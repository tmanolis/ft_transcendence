import {
  BadRequestException,
  ForbiddenException,
  GatewayTimeoutException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  AdminDTO,
  channelDTO,
  changePassDTO,
  toPublicDTO,
  dmDTO,
  ChatUser,
} from 'src/dto';
import { User, UserInRoom, RoomStatus, Message, Status } from '@prisma/client';
import * as argon from 'argon2';
import {
  RoomHistory,
  RoomWithUsers,
  UserWithRooms,
  UserInRoomWithUser,
} from 'src/interfaces';
import { ChatService } from 'src/chat/chat.service';
import { UserService } from 'src/user/user.service';
import { TimeoutError } from 'rxjs';

@Injectable()
export class ChannelService {
  constructor(
    private prisma: PrismaService,
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  /****************************************************************************/
  /* channel info											                                        */
  /****************************************************************************/

  async getChannelMembers(dto: channelDTO) {
    const room = await this.prisma.room.findUnique({
      where: {
        name: dto.name,
      },
    });
    if (!room) throw new NotFoundException('Room not found');

    const usersInRoom: UserInRoomWithUser[] =
      await this.prisma.userInRoom.findMany({
        where: {
          room: {
            name: dto.name,
          },
        },
        include: {
          user: true,
        },
      });

    const channelMembers = usersInRoom.map(
      (userInRoom: UserInRoomWithUser) => ({
        userName: userInRoom.user.userName,
        isBanned: userInRoom.isBanned,
        isMuted: userInRoom.isMuted,
        role: userInRoom.role,
      }),
    );

    return channelMembers;
  }

  async getOtherUser(user: User, dto: channelDTO) {
    const room = await this.getRoomWithUsers(dto.name);

    if (room.status !== RoomStatus.DIRECT) {
      throw new ForbiddenException('This is not a private room');
    }

    const usersInRoom: UserInRoomWithUser[] =
      await this.prisma.userInRoom.findMany({
        where: {
          room: {
            name: dto.name,
          },
        },
        include: {
          user: true,
        },
      });

    let otherUser: string | null = null;

    for (const userInRoom of usersInRoom) {
      if (userInRoom.user.id !== user.id) {
        otherUser = userInRoom.user.userName;
        break;
      }
    }

    if (otherUser === null) {
      throw new NotFoundException('You seem to be alone in this room');
    }

    return otherUser;
  }

  async getAllRooms() {
    const allRooms = await this.prisma.room.findMany({
      where: {
        OR: [{ status: 'PUBLIC' }, { status: 'PRIVATE' }],
      },
      select: {
        name: true,
        status: true,
        createdAt: true,
      },
    });
    return allRooms;
  }

  async getRoomUserWithUsername(
    username: string,
    room: RoomWithUsers,
  ): Promise<UserInRoom> {
    const user: User = await this.prisma.user.findUnique({
      where: {
        userName: username,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userInRoom = room.users.find(
      (userInRoom) => userInRoom.email === user.email,
    );

    if (!userInRoom) throw new NotFoundException('User is not in this room');

    return userInRoom;
  }

  async getRoomUser(user: User, room: RoomWithUsers): Promise<UserInRoom> {
    if (!user) {
      throw new NotFoundException('User not found, please reconnect');
    }

    const userInRoom = room.users.find(
      (userInRoom) => userInRoom.email === user.email,
    );

    if (!userInRoom) throw new NotFoundException('You are not in this room');

    return userInRoom;
  }

  async getRoomWithUsers(roomName: string): Promise<RoomWithUsers> {
    const room: RoomWithUsers = await this.prisma.room.findUnique({
      where: {
        name: roomName,
      },
      include: {
        users: true,
      },
    });

    if (!room) throw new NotFoundException('Room not found');

    return room;
  }

  /****************************************************************************/
  /* channel history									 			                                  */
  /****************************************************************************/

  async getChannelHistory(user: User, dto: channelDTO): Promise<RoomHistory> {
    const room: RoomWithUsers = await this.checkRoom(dto);
    const userInRoom: UserInRoom = await this.allowedToReceive(user, room);
    const blocked: string[] = await this.userService.getBlocklist(user);

    if (userInRoom) {
      const messages: Message[] = await this.prisma.message.findMany({
        where: {
          roomID: room.name,
          NOT: {
            sender: {
              in: blocked,
            },
          },
        },
      });
      return { room: room.name, messages };
    }
    return null;
  }

  async getFullHistory(user: User): Promise<RoomHistory[]> {
    const blocked: string[] = await this.userService.getBlocklist(user);

    const userRooms: UserWithRooms | null = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
      include: {
        rooms: true,
      },
    });

    if (!userRooms) {
      throw new NotFoundException('User not found');
    }

    let history: RoomHistory[] = [];

    for (const room of userRooms.rooms) {
      const messages = await this.prisma.message.findMany({
        where: {
          roomID: room.roomID,
          NOT: {
            sender: {
              in: blocked,
            },
          },
        },
      });

      history.push({
        room: room.roomID,
        messages: messages,
      });
    }

    return history;
  }

  async checkRoom(dto: channelDTO): Promise<RoomWithUsers> {
    // check if room exists
    const room: RoomWithUsers = await this.prisma.room.findUnique({
      where: {
        name: dto.name,
      },
      include: {
        users: true,
      },
    });

    if (!room) throw new NotFoundException('Room not found');

    return room;
  }

  async allowedToReceive(user: User, room: RoomWithUsers): Promise<UserInRoom> {
    // check if user is in room
    const userInRoom = await room.users.find((roomUser: UserInRoom) => {
      return roomUser.email === user.email;
    });

    if (!userInRoom) throw new NotFoundException('You are not in this room');

    // check if user is banned
    if (room.status !== RoomStatus.DIRECT) {
      if (userInRoom.isBanned)
        throw new ForbiddenException(
          'Too bad, you have been banned from this channel...',
        );
    }

    return userInRoom;
  }

  /****************************************************************************/
  /* owner options										                                        */
  /****************************************************************************/

  async toPublic(user: User, dto: toPublicDTO) {
    await this.ownerCheck(user, dto);

    try {
      await this.prisma.room.update({
        where: {
          name: dto.channel,
        },
        data: {
          status: 'PUBLIC',
          password: '',
        },
      });
    } catch (error) {
      throw new ForbiddenException('Error updating database');
    }

    // update channel
    await this.chatService.sendServerMessage({
      room: dto.channel,
      text: `This channel is now public`,
    });
  }

  async toPrivate(user: User, dto: changePassDTO) {
    await this.ownerCheck(user, dto);

    try {
      const hash: string = await argon.hash(dto.password);
      await this.prisma.room.update({
        where: {
          name: dto.channel,
        },
        data: {
          status: 'PRIVATE',
          password: hash,
        },
      });
    } catch (error) {
      throw new ForbiddenException('Error updating database');
    }

    // update channel
    await this.chatService.sendServerMessage({
      room: dto.channel,
      text: `This channel is now private`,
    });
  }

  async changePass(user: User, dto: changePassDTO) {
    await this.ownerCheck(user, dto);

    try {
      const hash: string = await argon.hash(dto.password);
      await this.prisma.room.update({
        where: {
          name: dto.channel,
        },
        data: {
          password: hash,
        },
      });
    } catch (error) {
      throw new ForbiddenException('Error updating database');
    }

    // update channel
    await this.chatService.sendServerMessage({
      room: dto.channel,
      text: `The password of this channel has been updated`,
    });
  }

  async addAdmin(user: User, dto: AdminDTO) {
    const room = await this.ownerCheck(user, dto);
    const subject = await this.getRoomUserWithUsername(dto.username, room);

    // few checks
    if (subject.role === 'OWNER')
      throw new BadRequestException('Can not downgrade room owner');
    if (subject.role === 'ADMIN')
      throw new BadRequestException('User is already admin');

    try {
      await this.prisma.userInRoom.update({
        where: {
          id: subject.id,
        },
        data: {
          role: 'ADMIN',
        },
      });
    } catch (error) {
      throw new ForbiddenException('Error updating database');
    }

    // update channel
    await this.chatService.sendServerMessage({
      room: dto.channel,
      text: `${dto.username} has been added to channel admins`,
    });
  }

  async removeAdmin(user: User, dto: AdminDTO) {
    const room = await this.ownerCheck(user, dto);
    const subject = await this.getRoomUserWithUsername(dto.username, room);

    if (subject.role === 'OWNER')
      throw new BadRequestException('Can not downgrade room owner');
    if (subject.role === 'USER')
      throw new BadRequestException('User is not admin');

    try {
      await this.prisma.userInRoom.update({
        where: {
          id: subject.id,
        },
        data: {
          role: 'USER',
        },
      });
    } catch (error) {
      throw new ForbiddenException('Error updating database');
    }

    // update channel
    await this.chatService.sendServerMessage({
      room: room.name,
      text: `${dto.username} has been removed as channel admin`,
    });
  }

  async ownerCheck(user: User, dto: toPublicDTO): Promise<RoomWithUsers> {
    const room = await this.getRoomWithUsers(dto.channel);
    const userInRoom = await this.getRoomUser(user, room);

    if (userInRoom.role !== 'OWNER')
      throw new UnauthorizedException('You are not the channel owner');

    return room;
  }

  /****************************************************************************/
  /* admin options										                                        */
  /****************************************************************************/

  async mute(user: User, dto: AdminDTO) {
    const room: RoomWithUsers = await this.getRoomWithUsers(dto.channel);
    const admin: UserInRoom = await this.adminCheck(user, room);
    const subject: UserInRoom = await this.getRoomUserWithUsername(
      dto.username,
      room,
    );
    this.relationCheck(admin, subject, 'mute');

    if (subject.isMuted) throw new BadRequestException('Mute already active');

    try {
      await this.prisma.userInRoom.update({
        where: {
          id: subject.id,
        },
        data: {
          isMuted: true,
        },
      });
    } catch (error) {
      throw new ForbiddenException('Error updating database');
    }

    const thirtyMinutes: number = 1800000;
    const oneMinute: number = 15000;
    setTimeout(async () => {
      try {
        const unmuted = await this.prisma.userInRoom.update({
          where: {
            id: subject.id,
          },
          data: {
            isMuted: false,
          },
        });
      } catch (error) {}
    }, oneMinute);
  }

  async ban(user: User, dto: AdminDTO) {
    const room: RoomWithUsers = await this.getRoomWithUsers(dto.channel);
    const admin: UserInRoom = await this.adminCheck(user, room);
    const subject: UserInRoom = await this.getRoomUserWithUsername(
      dto.username,
      room,
    );
    this.relationCheck(admin, subject, 'ban');

    if (subject.isBanned)
      throw new BadRequestException('This user is already banned');

    // set room user to banned to exclude them from channel events
    try {
      await this.prisma.userInRoom.update({
        where: {
          id: subject.id,
        },
        data: {
          isBanned: true,
        },
      });
    } catch (error) {
      throw new ForbiddenException('Error updating database');
    }

    // update channel
    await this.chatService.sendServerMessage({
      room: room.name,
      text: `${dto.username} has been banned from this channel`,
    });
  }

  async unban(user: User, dto: AdminDTO) {
    const room: RoomWithUsers = await this.getRoomWithUsers(dto.channel);
    const admin: UserInRoom = await this.adminCheck(user, room);
    const subject: UserInRoom = await this.getRoomUserWithUsername(
      dto.username,
      room,
    );
    this.relationCheck(admin, subject, 'unban');

    if (!subject.isBanned)
      throw new BadRequestException('This user is not banned');

    // unban room user
    try {
      await this.prisma.userInRoom.update({
        where: {
          id: subject.id,
        },
        data: {
          isBanned: false,
        },
      });
    } catch (error) {
      throw new ForbiddenException('Error updating database');
    }

    // update channel
    await this.chatService.sendServerMessage({
      room: room.name,
      text: `${dto.username} is back after a ban`,
    });
  }

  async kick(user: User, dto: AdminDTO) {
    const room: RoomWithUsers = await this.getRoomWithUsers(dto.channel);
    const admin: UserInRoom = await this.adminCheck(user, room);
    const subject: UserInRoom = await this.getRoomUserWithUsername(
      dto.username,
      room,
    );
    this.relationCheck(admin, subject, 'kick');

    // remove room user
    try {
      await this.prisma.userInRoom.delete({
        where: {
          id: subject.id,
        },
      });
    } catch (error) {
      throw new ForbiddenException('Error updating databse');
    }

    // update channel
    await this.chatService.sendServerMessage({
      room: room.name,
      text: `${dto.username} has been kicked from this channel`,
    });
  }

  async adminCheck(user: User, room: RoomWithUsers): Promise<UserInRoom> {
    const userInRoom: UserInRoom = room.users.find(
      (userInRoom: UserInRoom) => userInRoom.email === user.email,
    );

    if (!userInRoom) throw new NotFoundException('You are not this room');

    if (!(userInRoom.role === 'OWNER' || userInRoom.role === 'ADMIN'))
      throw new UnauthorizedException(
        'You need to be admin or owner for this operation',
      );

    return userInRoom;
  }

  relationCheck(admin: UserInRoom, otherUser: UserInRoom, action: string) {
    if (admin.role === 'ADMIN' && otherUser.role === 'ADMIN') {
      throw new ForbiddenException(`Can not ${action} other admin`);
    } else if (admin.role === 'ADMIN' && otherUser.role === 'OWNER') {
      throw new ForbiddenException('Can not ' + action + ' owner');
    }
    return true;
  }
}
