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

import { GameService } from './game.service';

@WebSocketGateway({ cors: true, namespace: 'game' })
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;

  /*****************************************************************************/
  /* handle connection                                                         */
  /*****************************************************************************/
  async handleConnection(client: Socket) {
    await this.gameService.userConnect(client, this.server);
  }

  /*****************************************************************************/
  /* handle disconnection                                                      */
  /*****************************************************************************/
  async handleDisconnect(client: Socket) {
    console.log(client.id, ' disconnected.');
  }

  /*****************************************************************************/
  /* player movements                                                          */
  /*****************************************************************************/
  @SubscribeMessage('leftPlayerMove')
  handleLeftPlayerMove(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ) {
    this.gameService.throttledPlayerMove(this.server, body, client, 'left');
  }

  @SubscribeMessage('rightPlayerMove')
  handleRightPlayerMove(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ) {
    this.gameService.throttledPlayerMove(this.server, body, client, 'right');
  }
}
