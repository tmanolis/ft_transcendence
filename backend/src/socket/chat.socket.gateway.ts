import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { ChatService } from "src/chat/chat.service";

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8080'],
  },
	namespace: 'chat',
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly chatService: ChatService,
	) {}

	/****************************************************************************/
  /* handle connection/disconnection                                          */
  /****************************************************************************/
	handleConnection(client: Socket) {
		// connect logic chat
	}

	handleDisconnect(client: Socket) {
		// disconnect logic chat
	}


	/****************************************************************************/
  /* handle connection/disconnection                                          */
  /****************************************************************************/


	/****************************************************************************/
  /* chat													                                            */
  /****************************************************************************/
	
	@SubscribeMessage('message')
  handleMessageReceived(client: Socket, payload: Object): Object {
    console.log(payload);
    console.log('Message received!!!');
    return { event: 'player message receivedt ', socketID: client.id };
  }


	/****************************************************************************/
  /* Direct Messaging								                                          */
  /****************************************************************************/


	/****************************************************************************/
  /* Channels				  							                                          */
  /****************************************************************************/





	/*
	To do:
	- Check if we need to add a socket.gateway.ts where we handle first connection
		and where the server object is created
	- Create message dto
	- Think of a naming convention for DM's (maybe: username1-username2)
	- Reconnect to rooms if socketID refreshes
	- Move respective reconnection issues to gameService/chatService
	- Implement a message queue?

	Functions: 
	(**** only if it's easy and we have time for it)

	onMessage(room, message) 
	- listens for messages from users

	findAllMessages(room): Promise <array>
	- returns message history

	createMessage()
	- checks if user has the right permissions to send this message
	- emits message to other user(s)
	- saves message in history
	- emits a notification to other user(s)?

	****isTyping()
	- lets other room/DM-users know that someone is typing

	DM functions:

		createDMRoom(user2DM)
		- creates a room with naming convention
		- sends some kind of invite to the other user?

		joinDMRoom(room? otherUser?)
		- make sure user belongs in this DM-room
		- join user to the room

		closeDMRoom(room)
		- unjoin both users from room

		blockUser(user2Bblocked)
		- mutes future messages from user2Bblocked

		unblockUser(user2Bunblocked)
		- unmutes future messages from user2Bunblocked

		listActiveDMs()
		- creates endpoint for active DM's and history?

	Channel functions: 
	
		createChannel(room)
		- creates a channel, either for DM's or channels
		- sets creator as channel owner and administrator
		- sets channel to either public, private or password protected
		- if password protected, sets password
	
		joinChannel(room)
		- checks if channel exists
		- joins channel
		- emits a message that user has joined the channel

		inviteToChannel(room, user2Binvited)
		- checks if user2Binvited exists
		- checks if user has rights to invite
		- emits invite to user2Binvited
		- emits message to inform channel users

		acceptInvitation(accept, room, inviter)
		- if false, emits message to inviter (return)
		- if true, joins user to the room
		- emits message to inform channel users

		closeChannel(room)
		- check is user is administrator
		- emit a message that channel will be closed?
		- unjoin all users from room  

		setPassword()
		- checks if user is administrator
		- creates a password
	
		addAdministrator(user2Badmin)
		- checks if user is administrator themselves
		- gives the user2Badmin permissions

		removeAdministrator(admin)
		- checks if user is administrator themselves
		- checks if admin is not the channel owner (creator)
		- if not, takes away admin's permissions

		banUser(user2Bbanned)
		- checks if user is administrator
		- kicks user2Bbanned from channel
		- puts user2Bbanned on a blacklist 

		muteUser(user2Bmutes)
		- checks if user is administrator
		- ignored the messages of user2Bmutes for a certain time period

		kickUser(user2Bkicked)
		- checks if user is administrator
		- removes user2Bkicked from the channel

		listUsers()
		- returns a list of users in the room

	*/

}