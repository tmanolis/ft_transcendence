import { Inject, UseGuards, forwardRef } from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from 'src/game/game.service';

@WebSocketGateway({
  cors: true,
})
export class SocketGateway implements OnGatewayConnection {
  constructor(
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
  ) {}

  private clients: Socket[] = [];

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // console.log(`Client ${user.userName}connected with socket ${client.id}`);
    this.clients.push(client);
    this.gameService.joinOrCreateGame(client.id);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients = this.clients.filter((socket) => socket.id !== client.id);
  }

  @SubscribeMessage('setCanvas')
  handleSetCanvas(client: Socket, payload: any) {
    this.gameService.setCanvas(payload);
  }

  @SubscribeMessage('movePaddle')
  handleMovePaddle(client: Socket, payload: string) {
    this.gameService.movePaddle(client, payload);
  }

  emitPaddleMovesLeft(
    leftPlayerID: string,
    rightPlayerID: string,
    newPosition: number,
  ) {
    this.server.to(leftPlayerID).emit('updateLeftPaddle', newPosition);
    this.server.to(rightPlayerID).emit('updateLeftPaddle', newPosition);
  }

  emitPaddleMovesRight(
    leftPlayerID: string,
    rightPlayerID: string,
    newPosition: number,
  ) {
    this.server.to(leftPlayerID).emit('updateRightPaddle', newPosition);
    this.server.to(rightPlayerID).emit('updateRightPaddle', newPosition);
  }

  startGame(leftPlayerID: string, rightPlayerID: string) {
    this.server.to(leftPlayerID).emit('endWaitingState');
    this.server.to(rightPlayerID).emit('endWaitingState');
  }
}
