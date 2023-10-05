import {
  BadRequestException,
  ForbiddenException,
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
} from 'src/dto';
import { User, UserInRoom, RoomStatus, Message } from '@prisma/client';
import * as argon from 'argon2';
import { RoomHistory, RoomWithUsers, UserWithRooms } from 'src/interfaces';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class ChannelService {
  constructor(
    private prisma: PrismaService,
    private readonly chatService: ChatService,
  ) {}

  /****************************************************************************/
  /* channel info											                                        */
  /****************************************************************************/

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

  async getDMRoomWithUsers(
    user: User,
    username: string,
  ): Promise<RoomWithUsers> {
    const otherUser: User = await this.prisma.user.findUnique({
      where: {
        userName: username,
      },
    });
    if (!otherUser) throw new NotFoundException('User not found');

    const roomName: string = this.chatService.uniqueRoomName(
      user.email,
      otherUser.email,
    );

    const room: RoomWithUsers = await this.getRoomWithUsers(roomName);

    if (!room) throw new NotFoundException('Room not found');

    return room;
  }

  async getRooms(user: User) {
    const userRooms = await this.prisma.user
      .findUnique({
        where: {
          id: user.id,
        },
      })
      .rooms({
        select: {
          room: {
            select: {
              name: true,
              status: true,
            },
          },
          role: true,
        },
      });

    const roomData = userRooms.map((userRoom) => ({
      name: userRoom.room.name,
      status: userRoom.room.status,
      role: userRoom.role,
    }));

    return roomData;
  }

  async getChannelMembers(dto: channelDTO) {
    const room = await this.prisma.room.findUnique({
      where: {
        name: dto.name,
      },
    });
    if (!room) throw new NotFoundException('Room not found');

    const usersInRoom = await this.prisma.userInRoom.findMany({
      where: {
        room: {
          name: dto.name,
        },
        isBanned: false,
      },
      select: {
        user: {
          select: {
            userName: true,
          },
        },
      },
    });

    const usernames = usersInRoom.map((userInRoom) => userInRoom.user.userName);

    return usernames;
  }

  /****************************************************************************/
  /* get history									 			                                      */
  /****************************************************************************/

  async getChannelHistory(user: User, dto: channelDTO): Promise<RoomHistory> {
    const room: RoomWithUsers = await this.checkRoom(dto);
    const userInRoom: UserInRoom = await this.allowedToReceive(user, room);

    if (userInRoom) {
      const messages: Message[] = await this.prisma.message.findMany({
        where: {
          roomID: room.name,
        },
      });
      return { room: room.name, messages };
    }
    return null;
  }

  async getFullHistory(user: User): Promise<RoomHistory[]> {
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
  /* dm options												                                        */
  /****************************************************************************/

  async block(user: User, dto: dmDTO) {
    const room: RoomWithUsers = await this.getDMRoomWithUsers(
      user,
      dto.userName,
    );
    const subject = await this.getRoomUserWithUsername(dto.userName, room);

    if (subject.isBlocked)
      throw new BadRequestException('You have already blocked this person');

    // unban room user
    await this.prisma.userInRoom.update({
      where: {
        id: subject.id,
      },
      data: {
        isBlocked: true,
      },
    });
  }

  async unblock(user: User, dto: dmDTO) {
    const room: RoomWithUsers = await this.getDMRoomWithUsers(
      user,
      dto.userName,
    );
    const subject = await this.getRoomUserWithUsername(dto.userName, room);

    if (!subject.isBlocked)
      throw new BadRequestException('This user is not blocked');

    // unban room user
    await this.prisma.userInRoom.update({
      where: {
        id: subject.id,
      },
      data: {
        isBlocked: false,
      },
    });
  }

  /****************************************************************************/
  /* owner options										                                        */
  /****************************************************************************/

  async toPublic(user: User, dto: toPublicDTO) {
    await this.ownerCheck(user, dto);

    await this.prisma.room.update({
      where: {
        name: dto.channel,
      },
      data: {
        status: 'PUBLIC',
        password: '',
      },
    });
  }

  async toPrivate(user: User, dto: changePassDTO) {
    await this.ownerCheck(user, dto);

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
  }

  async changePass(user: User, dto: changePassDTO) {
    await this.ownerCheck(user, dto);

    const hash: string = await argon.hash(dto.password);
    await this.prisma.room.update({
      where: {
        name: dto.channel,
      },
      data: {
        password: hash,
      },
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

    await this.prisma.userInRoom.update({
      where: {
        id: subject.id,
      },
      data: {
        role: 'ADMIN',
      },
    });
  }

  async removeAdmin(user: User, dto: AdminDTO) {
    const room = await this.ownerCheck(user, dto);
    const subject = await this.getRoomUserWithUsername(dto.username, room);

    if (subject.role === 'OWNER')
      throw new BadRequestException('Can not downgrade room owner');
    if (subject.role === 'USER')
      throw new BadRequestException('User is not admin');

    await this.prisma.userInRoom.update({
      where: {
        id: subject.id,
      },
      data: {
        role: 'USER',
      },
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

    await this.prisma.userInRoom.update({
      where: {
        id: subject.id,
      },
      data: {
        isMuted: true,
      },
    });

    const thirtyMinutes: number = 1800000;
    setTimeout(async () => {
      const unmuted = await this.prisma.userInRoom.update({
        where: {
          id: subject.id,
        },
        data: {
          isMuted: false,
        },
      });
    }, thirtyMinutes);
  }

  async ban(user: User, dto: AdminDTO) {
    const room: RoomWithUsers = await this.getRoomWithUsers(dto.channel);
    const admin: UserInRoom = await this.adminCheck(user, room);
    const subject: UserInRoom = await this.getRoomUserWithUsername(
      dto.username,
      room,
    );
    this.relationCheck(admin, subject, 'ban');

    // set room user to banned to exclude them from channel events
    await this.prisma.userInRoom.update({
      where: {
        id: subject.id,
      },
      data: {
        isBanned: true,
      },
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

    // unban room user
    await this.prisma.userInRoom.update({
      where: {
        id: subject.id,
      },
      data: {
        isBanned: false,
      },
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
    await this.prisma.userInRoom.delete({
      where: {
        id: subject.id,
      },
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
      throw new ForbiddenException('Can not ' + action + ' other admin');
    } else if (admin.role === 'ADMIN' && otherUser.role === 'OWNER') {
      throw new ForbiddenException('Can not ' + action + ' owner');
    }
    return true;
  }
}
