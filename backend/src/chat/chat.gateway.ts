import { SubscribeMessage, WebSocketGateway, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({cors:true})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any, client: any, payload: any) {
    this.server.emit('onMessage',  {
      msg: "hello",
      content: body,
    })
  }
}
