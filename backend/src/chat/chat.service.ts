import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';
import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { ChatUser, messageDTO, createRoomDTO, joinRoomDTO, ChatMessage } from "src/dto";
import { User, Message, RoomStatus, Room } from '@prisma/client';
import * as argon from 'argon2';
import { Socket, Server } from 'socket.io';
import { JwtService } from "@nestjs/jwt";
import { WebSocketServer } from "@nestjs/websockets";

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

	// async createChannel(user: User, roomDTO: createRoomDTO){
	// 	const existingRoom = await this.prisma.room.findUnique({
	// 		where: {
	// 			id: roomDTO.name,
	// 		}
	// 	})

	// 	if (existingRoom){
	// 		throw new ConflictException('Room already exists');
	// 	}
		
	// 	const status: RoomStatus = this.convertRoomStatus(roomDTO);
	// 	if (status === 'PRIVATE'){
	// 		if (!roomDTO.password) throw new ForbiddenException('Password mandatory for private channel');
	// 		else {
	// 			roomDTO.password = await argon.hash(roomDTO.password);
	// 		}
	// 	};

	// 	const newRoom = await this.prisma.room.create({
	// 		data: {
	// 			id: roomDTO.name,
	// 			owner: user.email,
	// 			admins: [user.email],
	// 			password: roomDTO.password,
	// 			status: status,
	// 			users: {
	// 				create: [{ 
	// 					user: { 
	// 						connect: { email: user.email } } }], 
	// 			}
	// 		}
	// 	})

	// 	return newRoom;
	// }

	// convertRoomStatus(roomDTO: createRoomDTO){
	// 	let status: RoomStatus;

	// 	switch (roomDTO.status) {
	// 		case 'public':
	// 			status = 'PUBLIC';
	// 			break;
	// 		case 'private':
	// 			if (!roomDTO.password) {
	// 				throw new ForbiddenException('Private room needs to be password protected');
	// 			}
	// 			status = 'PRIVATE';
	// 			break;
	// 		case 'direct':
	// 			status = 'DIRECT';
	// 			break;
	// 		default:
	// 			throw new ForbiddenException('Invalid status');
	// 	}
	// 	return status;
	// }

	// async joinChannel(user: User, roomDTO: joinRoomDTO){
	// 	const cacheUser: ChatUser = await this.fetchUser(user.email);
	// 	console.log('email', user.email);
	// 	console.log('chatuser', cacheUser);
	// 	if (!cacheUser) throw new ForbiddenException('Please reconnect.')

	// 	const room = await this.prisma.room.findUnique({
	// 		where: {
	// 			id: roomDTO.name,
	// 		}
	// 	})
		
	// 	if (!room) throw new BadRequestException('Room does not exist');

	// 	const isBanned = room.banned.some((blockedUser) => blockedUser === user.email);
	// 	if (isBanned) throw new ForbiddenException('You are banned from this channel');

	// 	if (room.status === 'DIRECT') throw new ForbiddenException('Not possible to join this room');
	// 	else if (room.status === 'PRIVATE'){
	// 		const passwordMatches = await argon.verify(room.password, roomDTO.password);
	// 		if (!passwordMatches) throw new ForbiddenException('Password incorrect');
	// 	};

	// 	cacheUser.rooms.push(joinRoomDTO.name);
	// 	await this.cacheManager.set('chat' + user.email, JSON.stringify(cacheUser));

	// 	const updatedRoom = await this.prisma.room.update({
	// 		where: {
	// 			id: room.id,
	// 		},
	// 		data: {
	// 			users: {
	// 				create: [{ 
	// 					user: { 
	// 						connect: { email: user.email } } }], 
	// 			}
	// 		},
	// 	});

	// 	return updatedRoom;
	// }

	/****************************************************************************/
  /* messages													                                        */
  /****************************************************************************/

	async handleMessage(message: messageDTO) {
		console.log('INCOMING MESSAGE', '\nroom: ', message.room, '\ntext: ', message.text);
		// const jwtData: { sub: string; email: string; iat: string; exp: string } | any = await this.getJWTData(client);
		// const chatuser: ChatUser = this.fetchChatuser(jwtData.email);

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