import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { ChatUser, createRoomDTO, joinRoomDTO, messageDTO } from 'src/dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8080'],
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  async afterInit(server: any) {
    this.chatService.server = server;
  }

  /****************************************************************************/
  /* handle connection/disconnection                                          */
  /****************************************************************************/
  async handleConnection(@ConnectedSocket() client: Socket) {
    this.chatService.newConnection(client);
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
  ) {
    await this.chatService.handleMessage(message);
  }

  /****************************************************************************/
  /* channels				  							                                          */
  /****************************************************************************/

  @SubscribeMessage('createChannel')
  async handleCreateChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() createDTO: createRoomDTO,
  ) {
    try {
      await this.chatService.createChannel(client, createDTO);
    } catch (error) {
      client.emit('createChannelError', { message: error.message });
    }
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() joinDTO: joinRoomDTO,
  ) {
    try {
      await this.chatService.joinChannel(client, joinDTO);
    } catch (error) {
      client.emit('joinChannelError', { message: error.message });
    }
  }
}
