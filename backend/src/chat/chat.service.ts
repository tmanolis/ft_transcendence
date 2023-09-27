import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  ChatUser,
  messageDTO,
  createRoomDTO,
  joinRoomDTO,
  ChatMessage,
} from 'src/dto';
import { User, RoomStatus, Room, UserInRoom } from '@prisma/client';
import * as argon from 'argon2';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { WebSocketServer } from '@nestjs/websockets';

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

    // update and reconnect user if they are in the cache already
    const existingUser: ChatUser = await this.fetchChatuser(email);
    if (existingUser) {
      this.reconnectChatuser(existingUser, client);
      return existingUser;
    }

    // reconnect user if they are in prisma
    const newUser: ChatUser | null = await this.reconnectPrismaUser(client, email);

		// send error message if not
		if (!newUser){
			client.emit('accessDenied', {
				message: 'Account not found, please reconnect.',
			});
			client.disconnect();
			return;
		}

    return newUser;
  }

  getEmailFromJWT(client: Socket) {
    const jwt = client.handshake.headers.authorization;

    if (jwt === undefined || jwt === null) {
      client.emit('accessDenied', {
        message: 'Authentification failed, please log in again.',
      });
      client.disconnect();
      return;
    } else {
      const jwtData:
        | { sub: string; email: string; iat: string; exp: string }
        | any = this.jwtService.decode(jwt);
      return jwtData.email;
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

  async reconnectChatuser(user: ChatUser, socket: Socket) {
		// update socket id
    user.socketID = socket.id;

		// rejoin rooms with new socket
    for (const room in user.rooms) {
      socket.join(room);
    }

		// update cache
    await this.cacheManager.set('chat' + user.email, JSON.stringify(user));
		console.log('update existing chat user:', user.email);
  }

	async reconnectPrismaUser(client: Socket, email: string): Promise<ChatUser>{
		const prismaUser = await this.prisma.user.findUnique({
			where: {
				email: email,
			}, include: {
				rooms: true,
			}
		})

		// check if prisma user exists
		if (!prismaUser){
			return null;
		}

		// create new chatuser
		const newChatUser = new ChatUser(
			prismaUser.email,
			client.id,
			prismaUser.userName,
			[],
		);

		// add connected rooms to chatuser and rejoin with new socket
		for (const room of prismaUser.rooms){
			newChatUser.rooms.push(room.roomID);
			client.join(room.roomID);
		}
		
		// push to cache
		await this.cacheManager.set(
			'chat' + prismaUser.email,
			JSON.stringify(newChatUser),
		);

		console.log('creating new chat user:', email);
		return newChatUser;
	}

  /****************************************************************************/
  /* channels												                                          */
  /****************************************************************************/

  async createChannel(client: Socket, roomDTO: createRoomDTO) {
    const email: string = this.getEmailFromJWT(client);
    const chatuser: ChatUser = await this.fetchChatuser(email);
    const prismaUser = await this.fetchPrismaUser(chatuser.email);

    try {
      await this.securityCheckCreateChannel(prismaUser, roomDTO);
    } catch (error) {
      throw error;
    }

    // join socket to room
    client.join(roomDTO.name);

    // create new room
    try {
      let newRoom = await this.prisma.room.create({
        data: {
          ...roomDTO,
          owner: chatuser.email,
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
        include: {
          users: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Channel could not be created, did you send the right variables?',
      ); 
		}

    // updating cache
    chatuser.rooms.push(joinRoomDTO.name);
    await this.cacheManager.set(
      'chat' + chatuser.email,
      JSON.stringify(chatuser),
    );

		if (roomDTO.status === RoomStatus.DIRECT){
			return await this.addOtherUser(roomDTO, email);
		} else {
			// sending a little welcome message
			const welcomeMessage: messageDTO = {
				room: roomDTO.name,
				sender: 'PongStoryShort',
				text: 'Congratulations! You have successfully created a channel.',
			};
			this.handleMessage(welcomeMessage);
		}
  }

  async securityCheckCreateChannel(prismaUser: User, roomDTO: createRoomDTO) {
    // check if user exists
    if (!prismaUser)
      throw new BadRequestException(
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

    //check if room exists
    if (existingRoom) throw new ConflictException('Room already exists');

    // check password for private room
    if (roomDTO.status === RoomStatus.PRIVATE) {
      if (!roomDTO.password)
        throw new ForbiddenException('Password mandatory for private channel');
      else {
        roomDTO.password = await argon.hash(roomDTO.password);
      }
    }
  }

  async joinChannel(client: Socket, roomDTO: joinRoomDTO) {
    const email: string = this.getEmailFromJWT(client);
    const chatuser: ChatUser = await this.fetchChatuser(email);
    const prismaUser = await this.fetchPrismaUser(chatuser.email);

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

    // updating cache
    chatuser.rooms.push(joinRoomDTO.name);
    await this.cacheManager.set(
      'chat' + chatuser.email,
      JSON.stringify(chatuser),
    );

    // sending a little welcome message
    const welcomeMessage: messageDTO = {
      room: roomDTO.name,
      sender: 'PongStoryShort',
      text: 'Please welcome ' + prismaUser.userName + ' to this channel!',
    };
    await this.handleMessage(welcomeMessage);
  }

  async securityCheckJoinChannel(prismaUser: User, roomDTO: joinRoomDTO) {
    // check if user exists
    if (!prismaUser)
      throw new BadRequestException(
        'Your account has been deleted. Please register again.',
      );

    // catch prisma error when variables are not correct
    let room;
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
      const passwordMatches = await argon.verify(
        room.password,
        roomDTO.password,
      );
      if (!passwordMatches) throw new ForbiddenException('Password incorrect');
    }
  }

  /****************************************************************************/
  /* dm room												                                          */
  /****************************************************************************/

	async addOtherUser(roomDTO: createRoomDTO, email: string){
		// parsing room name and find other email
		const otherEmail = this.parseDMRoomName(roomDTO.name, email);

		const otherPrismaUser = await this.prisma.user.findUnique({
			where: {
				email: otherEmail,
			}
		})
		if (!otherPrismaUser){
			throw new BadRequestException('Other user not found');
		}

    // connecting user and room in prisma
    await this.prisma.room.update({
      where: {
        name: roomDTO.name,
      },
      data: {
        users: {
          create: [
            {
              user: {
                connect: { email: otherEmail },
              },
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

		// updating cache object if existing
		const otherChatUser = await this.fetchChatuser(otherEmail);

		if (otherChatUser){
			otherChatUser.rooms.push(roomDTO.name);
			await this.cacheManager.set(
				'chat' + otherChatUser.email,
				JSON.stringify(otherChatUser)
			)
		}
	}

	parseDMRoomName(name: string, currentEmail: string){
		const parts = name.split('-');
		const [email1, email2] = parts;

		if (
			parts.length !== 2 || 
			!parts.includes(currentEmail) ||
			email2 > email1){
			throw new BadRequestException('Room name does not comply with naming convention');
		}

		return parts.find(email => email !== currentEmail);
	}

  /****************************************************************************/
  /* messages													                                        */
  /****************************************************************************/

  async handleMessage(message: messageDTO) {
    const date: number = Date.now();
    const newMessage: ChatMessage = {
      room: message.room,
      date: date,
      sender: message.sender,
      text: message.text,
    };

    // check if room exists?
    // check if user is in room?

    const roomHistory: string = await this.cacheManager.get(
      'room' + message.room,
    );
    const newRoomhistory: string =
      JSON.stringify(newMessage) + roomHistory || '';
    await this.cacheManager.set('room', newRoomhistory);

    this.server.to(message.room).emit('newMessage', JSON.stringify(newMessage));
  }

  // async roomMessageHistory(roomName: string): Promise<Message[]> {
  // 	return this.prisma.message.findMany({
  // 		where: {
  // 			roomID: roomName,
  // 		}
  // 	})
  // }

  // async userMessageHistory(user: ChatUser){
  // 	const prismaUser = await this.prisma.user.findUnique({
  // 		where: {
  // 			email: user.email,
  // 		}
  // 	})
  // 	const rooms = await this.prisma.roomUser.findMany({
  // 		where : {
  // 			email: prismaUser.email,
  // 		}
  // 	})

  // 	const messageHistory: Record<string, Message[]> = {};

  // 	for (const room of rooms){
  // 		const messages = await this.roomMessageHistory(room.roomID);
  // 		messageHistory[room.roomID] = messages;
  // 	}

  // 	return messageHistory;
  // }
}
