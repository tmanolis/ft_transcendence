import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { createRoomDTO, joinRoomDTO, messageDTO } from 'src/dto';
import { RoomStatus } from '@prisma/client';

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
      let channel: string;
      if (createDTO.status === RoomStatus.DIRECT) {
        channel = await this.chatService.createDirectMessage(client, createDTO);
      } else {
        channel = await this.chatService.createChannel(client, createDTO);
      }
      client.emit('createChannelSuccess', {
        message: 'Channel created with name ' + channel,
      });
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
