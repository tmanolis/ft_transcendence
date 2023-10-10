import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  ChatUser,
  messageDTO,
  createRoomDTO,
  joinRoomDTO,
  ChatMessage,
  channelDTO,
  SecureChannelDTO,
} from 'src/dto';
import { User, RoomStatus, Room, UserInRoom, Status } from '@prisma/client';
import * as argon from 'argon2';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { WebSocketServer } from '@nestjs/websockets';
import { RoomWithUsers, UserWithRooms } from 'src/interfaces';
import { isAlphanumeric } from 'class-validator';
import { RouterModule } from '@nestjs/core';

@Injectable()
export class ChatService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  /****************************************************************************/
  /* handle connection/disconnection                                          */
  /****************************************************************************/

  async newConnection(client: Socket): Promise<ChatUser | null> {
    // decode authorization header to get email
    const email: string = this.getEmailFromJWT(client);
    if (!email) return;

    // update cache and join socket to rooms
    const chatUser = await this.reconnectUser(email, client);

    // send error message if not found
    if (!chatUser) {
      client.emit('accessDenied', {
        message: 'Account not found, please reconnect.',
      });
      client.disconnect();
      return;
    }

    return chatUser;
  }

  getEmailFromJWT(client: Socket) {
    const jwt = client.handshake.headers.authorization;

    const jwtData:
      | { sub: string; email: string; iat: string; exp: string }
      | any = this.jwtService.decode(jwt);

    if (jwtData) return jwtData.email;
    else {
      client.emit('accessDenied', {
        message: 'Authentification failed, please log in again.',
      });
      client.disconnect();
      return;
    }
  }

  async fetchChatuser(email: string): Promise<ChatUser | null> {
    const cacheUser: string = await this.cacheManager.get('chat' + email);
    if (cacheUser) {
      const existingUser: ChatUser = JSON.parse(cacheUser);
      return existingUser;
    }

    return null;
  }

  async fetchPrismaUser(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async fetchPrismaUserWithRooms(email: string): Promise<UserWithRooms | null> {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        rooms: true,
      },
    });
  }

  async reconnectUser(email: string, socket: Socket) {
    // find user in prisma including connected rooms
    const prismaUser: UserWithRooms = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        rooms: true,
      },
    });

    if (!prismaUser) {
      return null;
    }

    // find user in cache
    let chatUser: ChatUser = await this.fetchChatuser(email);

    // update socketID or create new cache user
    if (chatUser) {
      chatUser.socketID = socket.id;
      console.log('update existing chat user:', email);
    } else {
      chatUser = new ChatUser(prismaUser.email, socket.id, prismaUser.userName);
      console.log('creating new chat user:', email);
    }

    // rejoin all rooms
    for (const room of prismaUser.rooms) {
      if (!room.isBanned) socket.join(room.roomID);
    }

    // set or update cache
    await this.cacheManager.set(`chat${email}`, JSON.stringify(chatUser));

    return chatUser;
  }

  /****************************************************************************/
  /* create channel									                                          */
  /****************************************************************************/

  async createChannel(client: Socket, roomDTO: createRoomDTO) {
    const email: string = this.getEmailFromJWT(client);
    const chatuser: ChatUser = await this.fetchChatuser(email);
    const prismaUser: UserWithRooms = await this.fetchPrismaUserWithRooms(
      chatuser.email,
    );
    let secureChannel: SecureChannelDTO;

    try {
      secureChannel = await this.securityCheckCreateChannel(
        prismaUser,
        roomDTO,
      );
    } catch (error) {
      throw error;
    }

    // join socket to room
    client.join(secureChannel.name);

    // create new room
    try {
      await this.prisma.room.create({
        data: {
          ...secureChannel,
          users: {
            create: [
              {
                user: {
                  connect: { email: chatuser.email },
                },
                role: 'OWNER',
              },
            ],
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Channel could not be created, did you send the right variables?',
      );
    }

    // send a little welcome message
    await this.sendServerMessage({
      room: secureChannel.name,
      text: 'Congratulations! You have successfully created a channel.',
    });

    // add the JOIN achievement
    if (!prismaUser.achievements.includes('JOIN')) {
      try {
        await this.prisma.user.update({
          where: {
            email: prismaUser.email,
          },
          data: {
            achievements: {
              push: 'JOIN',
            },
          },
        });
      } catch (error) {
        throw error;
      }
    }

    return secureChannel.name;
  }

  async securityCheckCreateChannel(
    prismaUser: User,
    roomDTO: createRoomDTO,
  ): Promise<SecureChannelDTO> {
    // check naming convention
    if (
      roomDTO.name &&
      roomDTO.status !== RoomStatus.DIRECT &&
      !roomDTO.name.match(/^[a-zA-Z0-9]+$/)
    )
      throw new BadRequestException(
        'Room names can only have alphanumeric characters',
      );

    // check if user exists
    if (!prismaUser)
      throw new NotFoundException(
        'Your account has been deleted. Please register again.',
      );

    // catch prisma error when variables are not correct
    let existingRoom: Room;
    try {
      existingRoom = await this.prisma.room.findUnique({
        where: {
          name: roomDTO.name,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Channel could not be created, did you send the right variables?',
      );
    }

    // check if room exists
    if (existingRoom) throw new ConflictException('Room already exists');

    // check password for private room and create secure object
    let secureChannel: SecureChannelDTO;
    if (roomDTO.status === RoomStatus.PRIVATE) {
      if (!roomDTO.password)
        throw new ForbiddenException('Password mandatory for private channel');
      else {
        roomDTO.password = await argon.hash(roomDTO.password);
      }
      secureChannel = new SecureChannelDTO(
        roomDTO.name,
        roomDTO.status,
        roomDTO.password,
      );
    } else {
      secureChannel = new SecureChannelDTO(roomDTO.name, roomDTO.status);
    }

    return secureChannel;
  }

	async callForReconnection(email: string){
		const chatUser: ChatUser = await this.fetchChatuser(email);
		if (chatUser) {
			this.server.to(chatUser.socketID).emit('reconnectNeeded', {
				message: `Please refresh page to reconnect socket`,
			});
		}	
	}

  /****************************************************************************/
  /* create dm room									                                          */
  /****************************************************************************/

  async createDirectMessage(
    client: Socket,
    roomDTO: createRoomDTO,
  ): Promise<string> {
    const email: string = this.getEmailFromJWT(client);
    const chatuser: ChatUser = await this.fetchChatuser(email);
    const prismaUser = await this.fetchPrismaUser(chatuser.email);
    let otherPrismaUser: User;
    let roomName: string;
    let secureChannel: SecureChannelDTO;

    try {
      otherPrismaUser = await this.prismaCheckOtherUser(
        roomDTO.name,
        prismaUser,
      );
      roomName = await this.uniqueRoomName();
      roomDTO.name = roomName;
      secureChannel = new SecureChannelDTO(roomName, roomDTO.status);
    } catch (error) {
      throw error;
    }

    // create a new room that is connected to both users
    try {
      await this.prisma.room.create({
        data: {
          ...secureChannel,
          name: roomName,
          users: {
            create: [
              {
                user: {
                  connect: { email: email },
                },
                role: 'USER',
              },
              {
                user: {
                  connect: { email: otherPrismaUser.email },
                },
                role: 'USER',
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Channel could not be created, did you send the right variables?',
      );
    }

    // join socket to room
    client.join(roomName);

    // notify other chatuser
		this.callForReconnection(otherPrismaUser.email);

    // send a little welcome message
    await this.sendServerMessage({
      room: secureChannel.name,
      text: `Welcome to this conversation, ${prismaUser.userName} and ${otherPrismaUser.userName}`,
    });

    return roomName;
  }

  async uniqueRoomName(): Promise<string> {
    let name: string;
    let room: Room;

    do {
      name = this.generateRandomString(10);
      room = await this.prisma.room.findUnique({
        where: {
          name: name,
        },
      });
    } while (room);

    return name;
  }

  generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += characters[Math.floor(Math.random() * characters.length)];
    }
    return randomString;
  }

  async prismaCheckOtherUser(
    username: string,
    currentUser: User,
  ): Promise<User> {
    if (username === currentUser.userName)
      throw new BadRequestException('Can not open chat with yourself');

    // check if current user exists
    if (!currentUser)
      throw new NotFoundException('Connection error, please register again.');

    // check if other user exists
    const otherPrismaUser = await this.prisma.user.findUnique({
      where: {
        userName: username,
      },
    });
    if (!otherPrismaUser) {
      throw new BadRequestException('Other user not found');
    }

    // check if they already have a DM room together
    const dmRoom = await this.prisma.room.findFirst({
      where: {
        AND: [
          {
            status: RoomStatus.DIRECT,
          },
          {
            users: {
              some: {
                email: currentUser.email,
              },
            },
          },
          {
            users: {
              some: {
                email: otherPrismaUser.email,
              },
            },
          },
        ],
      },
    });

    if (dmRoom)
      throw new BadRequestException(
        'You already have a conversation with them!',
      );

    return otherPrismaUser;
  }

  /****************************************************************************/
  /* join	channel									  	                                        */
  /****************************************************************************/

  async joinChannel(client: Socket, roomDTO: joinRoomDTO) {
    const email: string = this.getEmailFromJWT(client);
    const chatuser: ChatUser = await this.fetchChatuser(email);
    const prismaUser: UserWithRooms = await this.fetchPrismaUserWithRooms(
      chatuser.email,
    );

    try {
      await this.securityCheckJoinChannel(prismaUser, roomDTO);
    } catch (error) {
      throw error;
    }

    // joining socket to room
    client.join(roomDTO.name);

    // adding roomuser in prisma
    await this.prisma.room.update({
      where: {
        name: roomDTO.name,
      },
      data: {
        users: {
          create: [
            {
              user: {
                connect: { email: chatuser.email },
              },
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    // sending a little welcome message
    await this.sendServerMessage({
      room: roomDTO.name,
      text: `Please welcome ${prismaUser.userName} to this channel!`,
    });

    // add the JOIN achievement
    if (!prismaUser.achievements.includes('JOIN')) {
      try {
        await this.prisma.user.update({
          where: {
            email: prismaUser.email,
          },
          data: {
            achievements: {
              push: 'JOIN',
            },
          },
        });
      } catch (error) {
        throw error;
      }
    }
  }

  async securityCheckJoinChannel(prismaUser: User, roomDTO: joinRoomDTO) {
    // check if user exists
    if (!prismaUser)
      throw new BadRequestException(
        'Your account has been deleted. Please register again.',
      );

    // catch prisma error when variables are not correct
    let room: RoomWithUsers;
    try {
      room = await this.prisma.room.findUnique({
        where: {
          name: roomDTO.name,
        },
        include: {
          users: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Channel not found, did you send the right variables?',
      );
    }

    // check if room exists
    if (!room) throw new BadRequestException('This channel does not exist');

    // check if user hasn't been banned
    const userInRoom = await room.users.find((roomUser: UserInRoom) => {
      return roomUser.email === prismaUser.email;
    });
    if (userInRoom && userInRoom.isBanned)
      throw new ForbiddenException('Oh oh, you are banned from this channel');
    // check if user is already in channel
    else if (userInRoom)
      throw new ForbiddenException('You are already in this room');

    // check if room is joinable
    if (room.status === RoomStatus.DIRECT)
      throw new ForbiddenException(
        'Not possible to join a private conversation',
      );

    // check if password is correct for private room
    if (room.status === RoomStatus.PRIVATE) {
      if (!roomDTO.password)
        throw new ForbiddenException(
          'This channel is private, please provide a password',
        );
      const passwordMatches = await argon.verify(
        room.password,
        roomDTO.password,
      );
      if (!passwordMatches) throw new ForbiddenException('Password incorrect');
    }
  }

  /****************************************************************************/
  /* leave channel										                                        */
  /****************************************************************************/

  async leaveChannel(client: Socket, dto: channelDTO) {
    const email: string = this.getEmailFromJWT(client);
    const chatuser: ChatUser = await this.fetchChatuser(email);
    const prismaUser: UserWithRooms = await this.fetchPrismaUserWithRooms(
      chatuser.email,
    );
    let userInRoom: UserInRoom;

    // Some security checks
    try {
      userInRoom = await this.securityCheckLeaveChannel(prismaUser, dto);
    } catch (error) {
      throw error;
    }

    // unjoin socket
    client.leave(dto.name);

    // remove room user
    await this.prisma.userInRoom.delete({
      where: {
        id: userInRoom.id,
      },
    });

    // update channel that user has left
    await this.sendServerMessage({
      room: dto.name,
      text: `User ${prismaUser.userName} has left this channel.`,
    });
  }

  async securityCheckLeaveChannel(prismaUser: User, dto: channelDTO) {
    // check if user exists
    if (!prismaUser)
      throw new BadRequestException(
        'Your account has been deleted. Please register again.',
      );

    // catch prisma error when variables are not correct
    let room: RoomWithUsers;
    try {
      room = await this.prisma.room.findUnique({
        where: {
          name: dto.name,
        },
        include: {
          users: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Channel not found, did you send the right variables?',
      );
    }

    // check if room exists
    if (!room) throw new BadRequestException('This channel does not exist');

    // check if user is on channel
    const userInRoom = await room.users.find((roomUser: UserInRoom) => {
      return roomUser.email === prismaUser.email;
    });
    if (!userInRoom) throw new BadRequestException('You are not in this room');

    // check if user can leave this room
    if (room.status === RoomStatus.DIRECT)
      throw new ForbiddenException(
        'Not possible to leave a private conversation, you can block the other person in stead.',
      );

    return userInRoom;
  }

  /****************************************************************************/
  /* messages													                                        */
  /****************************************************************************/

  async sendServerMessage(message: messageDTO) {
    try {
      // Create the new message in the database
      await this.prisma.message.create({
        data: {
          ...message,
          sender: 'PongStoryShort',
          room: {
            connect: {
              name: message.room,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }

    // ping for update
    this.server
      .to(message.room)
      .emit('channelUpdated', 'please GET channel/history');
  }

  async stockMessage(client: Socket, message: messageDTO) {
    const email: string = this.getEmailFromJWT(client);
    const prismaUser: UserWithRooms = await this.fetchPrismaUserWithRooms(
      email,
    );

    try {
      // check if user and room exist
      const room: Room = await this.checkUserRoom(prismaUser, message);

      // check if user is allowed to send a message to this channel
      await this.allowedToSend(room, prismaUser);

			// check if message is not empty
			if (message.text === '') return

      // check message format and add sender name
      const checkedMessage = new ChatMessage(
        room.name,
        prismaUser.userName,
        message.text,
      );
      if (!checkedMessage)
        throw new BadRequestException(
          'Message could not be sent, did you add the right variables?',
        );

      // add message to room in database
      await this.prisma.message.create({
        data: {
          ...checkedMessage,
          room: {
            connect: {
              name: room.name,
            },
          },
        },
      });

      // ping for update
      this.server
        .to(room.name)
        .emit('channelUpdated', 'please GET channel/history');
    } catch (error) {
      throw error;
    }
  }

  async checkUserRoom(user: UserWithRooms, message: messageDTO): Promise<Room> {
    // check if sender exists
    if (!user) throw new NotFoundException('User not found');

    // check if room exists
    try {
      const room: Room | null = await this.prisma.room.findUnique({
        where: {
          name: message.room,
        },
      });

      if (!room) throw new NotFoundException('Room not found');

      return room;
    } catch (error) {
      throw new BadRequestException(
        'Channel not found, did you send the right variables?',
      );
    }
  }

  async allowedToSend(room: Room, user: UserWithRooms) {
    // check if user is in room
    const userInRoom = await user.rooms.find((roomUser: UserInRoom) => {
      return roomUser.roomID === room.name;
    });
    if (!userInRoom) throw new NotFoundException('You are not in this room');

    if (room.status !== RoomStatus.DIRECT) {
      // check if sender is muted
      if (userInRoom.isMuted)
        throw new ForbiddenException(
          'You have been temporarily muted by a channel admin. Retry sending your message later.',
        );

      // check if sender is banned
      if (userInRoom.isBanned)
        throw new ForbiddenException(
          "You have been banned from this channel, so don't even try...",
        );
    }
  }
}
