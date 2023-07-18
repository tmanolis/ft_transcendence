import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	// cors is already set up in main.ts, no need to do it again
	// cors: {
  //   origin: [
  //     'http://localhost:3000',
  //     'http://localhost:5173',
	// 		'http://localhost:8080',
  //     'http://jas0nhuang.eu.org:3000',
  //     'http://jas0nhuang.eu.org:5173',
  //   ],
  // },

	// Looked into namespaces and it seems that for simplicity reasons
	// it would be ideal for our application to combine everything in 1
	// gateway, in stead of adding separate namespaces.
  // namespace: 'game'
})

export class GameGateway {
  @WebSocketServer()
  server: Server;

  /****************************************************************************/
  /* handle connection                                                        */
  /****************************************************************************/
  async handleConnection(client: Socket) {
    // await this.gameService.userConnect(client, this.server);
  }

  /****************************************************************************/
  /* handle disconnection                                                     */
  /****************************************************************************/
  async handleDisconnect(client: Socket) {
    console.log(client.id, ' disconnected.');
  }

  /****************************************************************************/
  /* player movements                                                         */
  /****************************************************************************/
  @SubscribeMessage('leftPlayerMove')
  handleLeftPlayerMove(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ) {
    // this.gameService.throttledPlayerMove(this.server, body, client, 'left');
  }

  @SubscribeMessage('rightPlayerMove')
  handleRightPlayerMove(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ) {
    // this.gameService.throttledPlayerMove(this.server, body, client, 'right');
  }

  @SubscribeMessage('startGame')
  handleStartGame(@MessageBody() body: any, @ConnectedSocket() client: any) {
    // this.gameService.gameLoop(this.server, body, client);
  }

  @SubscribeMessage('canvasOffsetTop')
  handleCanvasOffsetTop(@MessageBody() body: number) {
    // this.gameService.setCanvasOffsetTop(body);
  }
}
