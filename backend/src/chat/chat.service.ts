import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';
import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { ChatUser, messageDTO, createRoomDTO, joinRoomDTO, ChatMessage } from "src/dto";
import { User, Message, RoomStatus, Room, RoomUser } from '@prisma/client';
import * as argon from 'argon2';
import { Socket, Server } from 'socket.io';
import { JwtService } from "@nestjs/jwt";
import { WebSocketServer } from "@nestjs/websockets";
import { userInfo } from "os";

@Injectable()
export class ChatService {
	constructor(
		@Inject (CACHE_MANAGER)
		private readonly cacheManager: Cache,
		private prisma: PrismaService,
		private readonly jwtService: JwtService,
	) {}
	
	@WebSocketServer()
	server: Server;

	/****************************************************************************/
  /* handle connection/disconnection                                          */
  /****************************************************************************/

	async newConnection(client: Socket): Promise<ChatUser | null>{
		// decode authorization header to get email
		const jwtData: { sub: string; email: string; iat: string; exp: string } | any = await this.getJWTData(client);
		if (!jwtData) return;
		
		// update and reconnect user if they are in the cache already
		const existingUser: ChatUser = await this.fetchChatuser(jwtData.email);
		if (existingUser){
			this.reconnectChatuser(existingUser, client);
			return existingUser;
		}

		// check if user exists in prisma
		const prismaUser: User = await this.prisma.user.findUnique({
			where: {
				email: jwtData.email,
			}
		})

		// create new user or disconnect
		if (!prismaUser){
			client.emit('chat', 'accessDenied', {message: 'Account not found, please reconnect.'})
			client.disconnect();
		} else {
			const newChatUser = new ChatUser(prismaUser.email, client.id, prismaUser.userName, []);
			console.log('creating new chat user:', prismaUser.email);
			await this.cacheManager.set('chat' + prismaUser.email, JSON.stringify(newChatUser));
			return newChatUser;
		}
	}
	
	getJWTData(client: Socket){
		const jwt = client.handshake.headers.authorization;
		
		if (jwt === 'undefined' || jwt === null){
			client.emit('accessDenied', { message: 'Authentification failed, please log in again.' });
			client.disconnect();
			return;
		} else {
			return this.jwtService.decode(jwt);
		}
	}
	
	async fetchChatuser(email: string): Promise<ChatUser | null>{
		const cacheUser: string = await this.cacheManager.get('chat' + email);
		if (cacheUser){
			const existingUser: ChatUser = JSON.parse(cacheUser);
			return existingUser;
		} 
		
		return null;
	}

	async reconnectChatuser(user: ChatUser, socket: Socket){
		user.socketID = socket.id;
		for (const room in user.rooms){
			socket.join(room);
		}
		await this.cacheManager.set('chat' + user.email, JSON.stringify(user));
		console.log('updating existing chat user:', user.email);
	}

	/****************************************************************************/
  /* channels												                                          */
  /****************************************************************************/

	async createChannel(user: User, roomDTO: createRoomDTO){
		const existingRoom = await this.prisma.room.findUnique({
			where: {
				name: roomDTO.name,
			}
		})

		if (existingRoom) throw new ConflictException('Room already exists');

		if (roomDTO.status === RoomStatus.PRIVATE){
			if (!roomDTO.password) throw new ForbiddenException('Password mandatory for private channel');
			else {
				roomDTO.password = await argon.hash(roomDTO.password);
			}
		};

		const newRoom = await this.prisma.room.create({
			data: {
				...roomDTO,
				owner: user.email,
				users: {
					create: [{ 
						user: { 
							connect: { email: user.email } } }],
				}
			},
			include: {
				users: true,
			}
		});

		const { password, ...secureRoom } = newRoom;
		return secureRoom;

		// still missing: 
		// * way to make a temp room for direct messaging
		// * join chatuser in gateway
		// * new roomUser should get role owner
	}


	async joinChannel(client: Socket, roomDTO: joinRoomDTO){
		const jwtData: { sub: string; email: string; iat: string; exp: string } | any = await this.getJWTData(client);
		const chatuser: ChatUser = await this.fetchChatuser(jwtData.email);

		// check if room exists
		const room = await this.prisma.room.findUnique({
			where: {
				name: roomDTO.name,
			}, include: {
				users: true,
			}
		})
		if (!room) throw new BadRequestException('Room does not exist');

		// check if user hasn't been banned
		const userInRoom = await room.users.find((roomUser: RoomUser) => {
			return roomUser.email === chatuser.email;
		});
		if (userInRoom && userInRoom.isBanned) throw new ForbiddenException('Oh oh, you are banned from this channel')
		else if (userInRoom) throw new ForbiddenException('You are already in this room');

		// check if room is joinable
		if (room.status === RoomStatus.DIRECT) throw new ForbiddenException('Not possible to join ');

		if (room.status === RoomStatus.PRIVATE){
			const passwordMatches = await argon.verify(room.password, roomDTO.password);
			if (!passwordMatches) throw new ForbiddenException('Password incorrect');
	}

		// joining in socket
		client.join(roomDTO.name);
		const updatedRoom = await this.prisma.room.update({
			where: {
				name: roomDTO.name,
			},
			data: {
				users: {
					create: [{ 
						user: { 
							connect: { email: chatuser.email } } }], 
				}
			},
			include: {
				users: true,
			}
		});


	// 	cacheUser.rooms.push(joinRoomDTO.name);
	// 	await this.cacheManager.set('chat' + user.email, JSON.stringify(cacheUser));
		console.log(updatedRoom);
		return updatedRoom;
	}


	/****************************************************************************/
  /* messages													                                        */
  /****************************************************************************/

	async handleMessage(message: messageDTO) {
		console.log('INCOMING MESSAGE', '\nroom: ', message.room, '\ntext: ', message.text);

		const date: number = Date.now();
		const newMessage: ChatMessage = {
			room: message.room,
			date: date,
			sender: message.sender,
			text: message.text,
		}

		// check if room exists? 
		// check if user is in room?

		const roomHistory: string = await this.cacheManager.get('room' + message.room);
		const newRoomhistory: string = JSON.stringify(newMessage) + roomHistory || '';
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