import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket, payload: any) {
    console.log('client auth: ', client.handshake.headers.authorization);
    console.log('client headers: ', client.handshake.headers);
    if (!client.handshake.headers.authorization) {
      client.disconnect();
      console.log('cannot connect!!!');
    }
    console.log(client.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any, client: any, payload: any) {
    this.server.emit('onMessage', {
      msg: 'hello',
      content: body,
    });
  }
}
