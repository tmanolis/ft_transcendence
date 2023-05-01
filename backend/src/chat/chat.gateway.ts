import { SubscribeMessage, WebSocketGateway, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any, client: any, payload: any): string {
    console.log(payload);
    console.log(body);
	this.server.emit('onMessage',  {
		msg: "hello",
		content: body,
	})
    return 'Hello world!';
  }
}
