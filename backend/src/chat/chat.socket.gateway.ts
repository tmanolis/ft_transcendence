import { OnModuleInit } from "@nestjs/common";
import { 
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection, 
	OnGatewayDisconnect, 
	SubscribeMessage, 
	WebSocketGateway,
	WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { ChatService } from "src/chat/chat.service";
import { ChatUser, joinRoomDTO, messageDTO } from "src/dto";

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8080'],
  },
	namespace: 'chat',
})

export class ChatGateway 
	implements 
		OnGatewayConnection, 
		OnGatewayDisconnect {
	constructor(
		private readonly chatService: ChatService,
		) {	}

	async afterInit(server: any) {
    this.chatService.server = server;
  }

	/****************************************************************************/
  /* handle connection/disconnection                                          */
  /****************************************************************************/
	async handleConnection(@ConnectedSocket() client: Socket) {
		this.chatService.newConnection(client);
		client.join('randomRoom');

		// const chatHistory = this.chatService.userMessageHistory(user)
		// client.emit('updateChatHistory', chatHistory);
	}

	async handleDisconnect(@ConnectedSocket() client: Socket) {
		// not sure if we have to do anything here...
		// maybe save all chat history if we decide to use the cache
		console.log('chatuser disconnected: ', client.id);
	}

  /****************************************************************************/
  /* messages											                											      */
  /****************************************************************************/
	
	@SubscribeMessage('sendMessage')
  async handleMessageReceived(
		@ConnectedSocket() client: Socket,
		@MessageBody() message: messageDTO,
	){
		await this.chatService.handleMessage(message);
  }

	// @SubscribeMessage('updateHistory')
	// async handleUpdateHistor(
	// 	@ConnectedSocket() client: Socket){
	// 		const jwtData: { sub: string; email: string; iat: string; exp: string } | any = this.verifyJWT(client);
	// 		const user: ChatUser = await this.chatService.fetchUser(jwtData.email);
	// 		try {
	// 			const messageHistory = await this.chatService.userMessageHistory(user);
		
	// 			if (messageHistory) {
	// 				client.emit('updateHistory', messageHistory);
	// 			} else {
	// 				client.emit('updateHistory', []);
	// 			}
	// 		} catch (error) {
	// 			client.emit('errorUpdateHistory', error);
	// 		}	
	// }

	/****************************************************************************/
  /* channels				  							                                          */
  /****************************************************************************/

	@SubscribeMessage('joinChannel')
	handleJoinChannel(
		@ConnectedSocket() client: Socket,
		@MessageBody() joinDTO: joinRoomDTO,
	){
		this.chatService.joinChannel(client, joinDTO);
	}



	/*
	To do:
	- See if messages/rooms should be stored in the cache or that prisma suffices
	- Move respective reconnection issues to gameService/chatService
	- Implement a message queue?

	Functions: 
	(**** only if it's easy and we have time for it)

	General functions:

		findAllMessages(room): Promise <array>
		- returns message history from prisma/Redis?

		createMessage(room, message)
		- creates message in prisma
		- creates message in Redis?

		sendMessage(room, message)
		- emits message to room

		****isTyping()
		- lets other room/DM-users know that someone is typing
		
		blockUser(user2Bblocked)
		- mutes future messages from user2Bblocked

		unblockUser(user2Bunblocked)
		- unmutes future messages from user2Bunblocked

	Channel functions:
	
		createChannel(room, status)
		- creates a channel, either for DM's or channels
		- sets creator as channel owner and administrator
		- sets channel to either public, private or password protected
		- if password protected, sets password
	
		joinChannel(room)
		- checks if channel exists
		- checks if its public/private/direct
		- joins channel
		- emits a message that user has joined the channel

		leaveChannel(room)
		- removes user from channel
		- emits a message that user has left the channel

		closeChannel(room)
		- check if user is administrator
		- emit a message that channel will be closed?
		- unjoin all users from room  

		setChannelPassword()
		- checks if user is administrator
		- creates a password
		- sets channel status to private
	
		addAdministrator(user2Badmin)
		- checks if user is administrator themselves
		- check if there's no active block or mute
		- gives the user2Badmin permissions

		removeAdministrator(admin)
		- checks if user is administrator themselves
		- checks if admin is not the channel owner (creator)
		- if not, takes away admin's permissions
		
		kickUser(user2Bkicked)
		- checks if user is administrator
		- removes user2Bkicked from the channel

		banUser(user2Bbanned)
		- checks if user is administrator
		- kicks user2Bbanned from channel
		- puts user2Bbanned on a blacklist

		muteUser(user2Bmutes)
		- checks if user is administrator
		- ignored the messages of user2Bmutes for a certain time period

		listUsers()
		- returns a list of users in the room

	*/

}