import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';
import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { ChatUser, messageDTO, createRoomDTO, joinRoomDTO } from "src/dto";
import { User, Message, RoomStatus, Room } from '@prisma/client';
import * as argon from 'argon2';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
	constructor(
		@Inject (CACHE_MANAGER)
		private readonly cacheManager: Cache,
		private prisma: PrismaService,
	) {}


	/****************************************************************************/
  /* handle connection/disconnection                                          */
  /****************************************************************************/

	async newConnection(socket: Socket, email: string): Promise< ChatUser | null >{
		const existingUser: ChatUser = await this.fetchUser(email);

		if (existingUser) {
			existingUser.socket = socket;
			await this.cacheManager.set('chat' + email, JSON.stringify(existingUser));
			console.log('updating existing chat user:', existingUser.email);
			return existingUser;
		}

		const user = await this.prisma.user.findUnique({
			where: {
				email: email,
			}
		})

		if (!user){
			return null;
		} else {
			const newChatUser = new ChatUser(user.email, socket, user.userName, null);
			await this.cacheManager.set('chat' + user.email, JSON.stringify(newChatUser));
			console.log('created new chat user:', newChatUser.email);
			return newChatUser;
		}
	}

	async fetchUser(email: string): Promise<ChatUser | null>{
		const cacheUser: string = await this.cacheManager.get('chat' + email);
		if (cacheUser){
			const existingUser: ChatUser = JSON.parse(cacheUser);
			return existingUser;
		} 
		
		return null;
	}


	/****************************************************************************/
  /* channels												                                          */
  /****************************************************************************/

	async createChannel(user: User, roomDTO: createRoomDTO){
		const existingRoom = await this.prisma.room.findUnique({
			where: {
				id: roomDTO.name,
			}
		})

		if (existingRoom){
			throw new ConflictException('Room already exists');
		}
		
		const status: RoomStatus = this.convertRoomStatus(roomDTO);
		if (status === 'PRIVATE'){
			if (!roomDTO.password) throw new ForbiddenException('Password mandatory for private channel');
			else {
				roomDTO.password = await argon.hash(roomDTO.password);
			}
		};
		try {
			this.joinUsers(roomDTO, user);
		} catch (error){
			return error;
		}

		const newRoom = await this.prisma.room.create({
			data: {
				id: roomDTO.name,
				owner: user.email,
				admins: [user.email],
				password: roomDTO.password,
				status: status,
				users: {
					create: [{ user: { connect: { id: user.id } } }], 
				}
			}
		})

		return newRoom;
	}

	async joinUsers(roomDTO: createRoomDTO, user: User){
		if (roomDTO.status === 'direct'){
			const emails = roomDTO.name.split('-');
      const [email1, email2] = emails;

      const user1 = await this.fetchUser(email1);
			if (user1){
				user1.socket.join(roomDTO.name);
			}

			const user2 = await this.fetchUser(email2);
			if (user2){
				user2.socket.join(roomDTO.name);
			} 
			// to add: if one of the users doesn't exist, make a temporary room
			// that will go live as soon as the missing user connects to the chat.
		} else {
			const socketUser = await this.fetchUser(user.email);
			socketUser.socket.join(roomDTO.name);
		}
	}

	convertRoomStatus(roomDTO: createRoomDTO){
		let status: RoomStatus;

		switch (roomDTO.status) {
			case 'public':
				status = 'PUBLIC';
				break;
			case 'private':
				if (!roomDTO.password) {
					throw new ForbiddenException('Private room needs to be password protected');
				}
				status = 'PRIVATE';
				break;
			case 'direct':
				status = 'DIRECT';
				break;
			default:
				throw new ForbiddenException('Invalid status');
		}
		return status;
	}

	async joinChannel(user: User, roomDTO: joinRoomDTO){
		const cacheUser: ChatUser = await this.fetchUser(user.email);
		if (!cacheUser) throw new ForbiddenException('User profile deleted, please register again.')

		const room = await this.prisma.room.findUnique({
			where: {
				id: roomDTO.name,
			}
		})
		
		if (!room) throw new BadRequestException('Room does not exist');

		const isBanned = room.banned.some((blockedUser) => blockedUser === user.email);
		if (isBanned) throw new ForbiddenException('You are banned from this channel');

		if (room.status === 'DIRECT') throw new ForbiddenException('Not possible to join this room');
		else if (room.status === 'PRIVATE'){
			const passwordMatches = await argon.verify(room.password, roomDTO.password);
			if (!passwordMatches) throw new ForbiddenException('Password incorrect');
		};

		cacheUser.rooms.push(joinRoomDTO.name);
		this.cacheManager.set('chat' + user.email, JSON.stringify(cacheUser));

		const updatedRoom = await this.prisma.room.update({
			where: {
				id: room.id,
			},
			data: {
				users: {
					connect: { id: user.id },
				},
			},
		});

		return updatedRoom;
	}

	/****************************************************************************/
  /* messages													                                        */
  /****************************************************************************/

	createMessage(user: ChatUser, roomName: string, message: messageDTO) {
		const room = this.prisma.room.findUnique({
			where: {
				id: roomName,
			}
		})

		// if (user is blocked){
		// 	throw new ForbiddenException('user has been blocked')
		// }

		// if (room doesn't exist){
		// 	throw new BadRequestException('room does not exist')
		// }

		// save in prisma
		return true;
	}

	async roomMessageHistory(roomName: string): Promise<Message[]> {
		return this.prisma.message.findMany({
			where: {
				roomID: roomName,
			}
		})
	}

	async userMessageHistory(user: ChatUser){
		const prismaUser = await this.prisma.user.findUnique({
			where: {
				email: user.email,
			}
		})
		const rooms = await this.prisma.roomUser.findMany({
			where : {
				userID: prismaUser.id,
			}
		})

		const messageHistory: Record<string, Message[]> = {};

		for (const room of rooms){
			const messages = await this.roomMessageHistory(room.roomID);
			messageHistory[room.roomID] = messages;
		}

		return messageHistory;
	}

}