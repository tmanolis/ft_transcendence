// import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';
import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { ChatUser } from "src/dto";


@Injectable()
export class ChatService {
	constructor(
		// @Inject (CACHE_MANAGER)
		// private readonly prisma: PrismaService,
		// private readonly cacheManager: Cache,
	) {}

	async newConnection(email: string, socketID: string){
		console.log(email, socketID);
		// const cacheUser: string = await this.cacheManager.get('chat' + email);

		// if (cacheUser) {
		// 	const existingUser: ChatUser = JSON.parse(cacheUser);
		// 	existingUser.socketID = socketID;
		// 	await this.cacheManager.set('chat' + email, JSON.stringify(existingUser));
		// 	console.log('updating existing chat user:', existingUser.email);
		// 	return existingUser;
		// }

		// const user = await this.prisma.user.findUnique({
		// 	where: {
		// 		email: email,
		// 	}
		// })

		// if (!user){
		// 	return null;
		// } else {
		// 	const newChatUser = new ChatUser(user.email, socketID, user.userName, null);
		// 	await this.cacheManager.set('chat' + user.email, JSON.stringify(newChatUser));
		// 	console.log('created new chat user:', newChatUser.email);
		// 	return newChatUser;
		// }
	}
}