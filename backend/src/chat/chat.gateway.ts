import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true, namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket, payload: any) {
    if (!client.handshake.headers.authorization) {
      client.disconnect();
      console.log('cannot connect!!!');
    }
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any, client: any, payload: any) {
    this.server.emit('onMessage', {
      msg: 'hello',
      content: body,
    });
  }
}
