import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';
import { ConflictException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { ChatUser, messageDTO, createRoomDTO } from "src/dto";
import { User, Room, Message } from '@prisma/client'

@Injectable()
export class ChatService {
	constructor(
		@Inject (CACHE_MANAGER)
		private readonly cacheManager: Cache,
		private prisma: PrismaService,
	) {}

	async newConnection(socketID: string, email: string): Promise< ChatUser | null >{
		const existingUser: ChatUser = await this.fetchUser(email);

		if (existingUser) {
			existingUser.socketID = socketID;
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
			const newChatUser = new ChatUser(user.email, socketID, user.userName, null);
			await this.cacheManager.set('chat' + user.email, JSON.stringify(newChatUser));
			console.log('created new chat user:', newChatUser.email);
			return newChatUser;
		}
	}

	async disconnect(email: string): Promise<ChatUser | null>{
		const existingUser = await this.fetchUser(email);
		
		if (existingUser){
			return existingUser;
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

	async createChannel(user: User, roomDTO: createRoomDTO){
		const existingRoom = await this.prisma.room.findUnique({
			where: {
				id: roomDTO.name,
			}
		})
		if (existingRoom){
			throw new ConflictException('Room already exists');
		}

		const newRoom = await this.prisma.room.create({
			data: {
				id: roomDTO.name,
				users: {
					connect: [{ id: user.id }],
				}
			}
		})
		return newRoom;
	}

	async messageHistoryRoom(roomName: string): Promise<Message[]> {
		return this.prisma.message.findMany({
			where: {
				roomID: roomName,
			}
		})
	}

	fullMessageHistory(user: ChatUser){
		for (const room of user.rooms){
			
		}
	}

	createMessage(user: ChatUser, room: string, message: messageDTO) {
		// if (user is blocked){
		// 	return false;
		// }

		// if (room doesn't exist){
		// 	return false;
		// }

		// save in prisma
		return true;
	}
}