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
import { JwtService } from '@nestjs/jwt';

import { GameService } from '../game/game.service';
// Will implement latter
// import { ChatService } from './chat/chat.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8080'],
  },
})
export class SocketGateway implements OnGatewayConnection {
  constructor(
    private readonly gameService: GameService,
    private readonly jwtService: JwtService,
  ) {}
  @WebSocketServer()
  server: Server;

  /****************************************************************************/
  /* handle connection/disconnection                                          */
  /****************************************************************************/
  async handleConnection(client: Socket) {
    const jwt = client.handshake.headers.authorization;
    const jwtData = this.jwtService.decode(jwt);
    console.log(jwtData);
    console.log(client.id, ' connected to generic socket. ^_^');
    if (!jwtData) {
      console.log(client.id, 'Forbiden connection.');
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(client.id, ' disconnected from generic socket. 0.0');
  }

  /****************************************************************************/
  /* GAME                                                                     */
  /****************************************************************************/
  @SubscribeMessage('playGame')
  handlePlayGame(client: Socket) {
    console.log(client.id, ' try to play the game');
    let players = this.gameService.joinOrCreateGame(client.id);
    if (players === undefined) return;
    if (players[0] !== undefined && players[1] !== undefined) {
      console.log('game can start');
      this.server.to(players[0]).emit('endWaitingState');
      this.server.to(players[1]).emit('endWaitingState');
    }
    // maybe use the "join" method in socket.io?
  }

  @SubscribeMessage('startGame')
  handleStartGame(client: Socket, payload: Object): Object {
    // probably need "client/socket id" from both client and save it into the "gamedata" object.
    console.log("Let's go!");
    let gameData = { x: -99, y: -99 };
    console.log(gameData);

    // Move the GAME LOOP(gameInterval) here so all the event listener/emitter will stay in this gateway file
    // gameInterval will call "gameLogic" 30 times per second.
    const gameInterval = setInterval(async () => {
      gameData = this.gameService.gameLogic(client, gameData);
      this.server.to(client.id).emit('updateBall', gameData);
      // also need to ubpdate the paddle for both sides.
    }, 1000 / 30);

    return { event: 'start game', socketID: client.id };
  }

  @SubscribeMessage('movePaddle')
  handleMovePaddle(client: Socket, payload: string): Object {
    const gameData = this.gameService.movePaddle(client, payload);
    console.log(gameData);
    this.server
      .to(gameData.currentGame.rightPlayer.socketID)
      .emit('updateRightPaddle', gameData.currentPlayer.paddlePosition);
    console.log(payload);
    console.log('Paddle movinnnnn!!!');
    return { event: 'player paddle move', socketID: client.id };
  }

  /****************************************************************************/
  /* CHAT                                                                     */
  /****************************************************************************/
  @SubscribeMessage('message')
  handleMessageReceived(client: Socket, payload: Object): Object {
    console.log(payload);
    console.log('Message received!!!');
    return { event: 'player message receivedt ', socketID: client.id };
  }
}
