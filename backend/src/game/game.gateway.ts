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

  async handleConnection(client: Socket, payload: any) {
    console.log(client.id, ' connected.');
    await this.gameService.userConnect(client);
  }

  /******************************************************************************/
  /* handle the disconnection                                                   */
  /******************************************************************************/
  async handleDisconnect(client: Socket, payload: any) {
    console.log(client.id, ' disconnected.');
  }

  @SubscribeMessage('leftPlayerMove')
  handleLeftPlayerMove(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ) {
    this.gameService.playerMove(this.server, body, client, 'left');
  }

  @SubscribeMessage('rightPlayerMove')
  handleRightPlayerMove(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ) {
    this.gameService.playerMove(this.server, body, client, 'right');
  }
}
