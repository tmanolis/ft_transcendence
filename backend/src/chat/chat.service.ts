import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';
import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { ChatUser, messageDTO, roomDTO } from "src/dto";
import { User, Room, Message } from '@prisma/client'

@Injectable()
export class ChatService {
	constructor(
		@Inject (CACHE_MANAGER)
		private readonly cacheManager: Cache,
		private prisma: PrismaService,
	) {}

	async newConnection(email: string, socketID: string): Promise< ChatUser | null >{
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
			const user = await this.prisma.user.findUnique({
				where: {
					email: email,
				}
			})
			if (user.status === 'OFFLINE'){
				this.cacheManager.del('chat' + email);
				return null;
			} else {
				return existingUser;
			}
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

	async openOrCreateDM(user: User, room: roomDTO){
		const existingRoom = this.cacheManager.get('room' + roomDTO.name);
		if (existingRoom){
			return this.findAllMessages(roomDTO.name);
		}

		const otherUser = await this.prisma.user.findUnique({
			where: {
				userName: room.otherUser,
			}
		})

		await this.prisma.room.create({
			data: {
				id: room.name,
				users: {
					connect: [
						{ id: user.id },
						{ id: otherUser.id }
					]
				}
			}
		})
	}

	async findAllMessages(roomName: string): Promise<Message[]> {
		return this.prisma.message.findMany({
			where: {
				roomID: roomName,
			}
		})
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