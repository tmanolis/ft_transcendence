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
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'nestjs-prisma';
import { Cache } from 'cache-manager';
import { Game, GameStatus, Player } from '../dto/game.dto';

import { GameService } from '../game/game.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8080'],
  },
})
export class SocketGateway implements OnGatewayConnection {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly gameService: GameService,
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  @WebSocketServer()
  server: Server;
  pauseCounter = 300;

  /****************************************************************************/
  // handle connection
  /****************************************************************************/
  async handleConnection(client: Socket) {
    if (await this.gameService.identifyUser(client) === 'failed') {
      client.disconnect();
    }
  }

  /****************************************************************************/
  // handle disconnection
  /****************************************************************************/
  async handleDisconnect(client: Socket) {
    console.log('\x1b[31m Disconnect! \x1b[0m');
    await this.gameService.cancelPendingGame(client);
    await this.gameService.updateUserDisconnectStatus(client);
    await this.gameService.clearData(client);
    console.log(`Socket: ${client.id} disconnected from game socket. 0.0`);
  }

  /****************************************************************************/
  // Find game
  /****************************************************************************/
  @SubscribeMessage('findGame')
  async handleFindGame(client: Socket) {
    let currentPlayer = await this.gameService.createPlayer(client);
    if (!currentPlayer) return;

    const pausedGameID = await this.gameService.findPausedGame(client);
    if (pausedGameID) 
      currentPlayer.gameID = pausedGameID;

    let newGame: Game = await this.gameService.createGame(client);
    if (newGame) 
      currentPlayer.gameID = newGame.gameID;

    const startGame: [boolean, string] =
      await this.gameService.findMatchingGame(currentPlayer);
    const gameRoom: string = startGame[1];
    client.join(gameRoom);

    if (startGame[0]) {
      this.server.to(gameRoom).emit('endWaitingState');
    }
  }

  /****************************************************************************/
  // GAME
  /****************************************************************************/
  @SubscribeMessage('setCanvas')
  handleSetCanvas(client: Socket, payload: any) {
    this.gameService.setCanvas(payload);
  }

  @SubscribeMessage('startGame')
  async handleStartGame(client: Socket, payload: Object): Promise<Object> {
    const currentPlayer = await this.gameService.getSocketPlayer(client);
    if (!currentPlayer) return;

    const gameRoom: string = currentPlayer.gameID;
    let gameData: Game;

    const gameInterval = setInterval(async () => {
      gameData = await this.gameService.gameLogic(client);
      if (!gameData) {
        clearInterval(gameInterval);
        return;
      }
      if (gameData.leftPlayer === null || gameData.rightPlayer === null) {
        clearInterval(gameInterval);
        return;
      }
      // also need to ubpdate the paddle for both sides.
      if (gameData.status === GameStatus.Pause) {
        this.server.to(gameRoom).emit('pause', this.pauseCounter);
        this.pauseCounter--;
        if (this.pauseCounter === 0) {
          gameData.status = GameStatus.Ended;
        }
      } else if (gameData.status === GameStatus.Ended) {
        this.server.to(gameRoom).emit('updateGame', gameData);
        this.server.to(gameRoom).emit('ended', gameData);
      } else {
        this.pauseCounter = 300;
        this.server.to(gameRoom).emit('updateGame', gameData);
      }

      if (gameData.status === GameStatus.Ended) {
        clearInterval(gameInterval);
        await this.gameService.endGame(gameData)
      }
    }, 1000 / 30);


    return { event: 'start game', socketID: client.id };
  }

  // will modify the invitation function latter
  /*
  @SubscribeMessage('invitePlayer')
  async handleInvitePlayer(client: Socket, payload: { inviting: string }) {
    const currentPlayerEmail = await this.cacheManager.get(client.id);
    const currentPlayer = await this.cacheManager.get(`game${currentPlayerEmail}`);
    const currentPlayerObject: Player = JSON.parse(currentPlayer);

    // payload will give email (instead of userName) as inviting string
    const invitedPlayer = await this.prisma.user.findUnique({
      where: {
        email: payload.inviting,
      },
    });

    // check if player is found, and is available:
    if (!invitedPlayer) {
      this.server
        .to(client.id)
        .emit('errorGameInvite', { error: 'Player not found' });
      return;
    }

    console.log(invitedPlayer);
    if (invitedPlayer.status !== 'ONLINE') {
      console.log('not available', user);
      this.server
        .to(client.id)
        .emit('errorGameInvite', { error: 'Player not available' });
      return;
    }

    this.gameService.createWaitingGame(currentPlayer);
    console.log('player before emit', currentPlayer);
    const gameID = currentPlayer.gameID.toString();
    client.join(gameID);
    this.server
      .to(invitedPlayer.socketID)
      .emit('gameInvite', { invitedBy: currentPlayer.userName });
  }

  @SubscribeMessage('respondToInvite')
  async handleRespondToInvite(client: Socket, payload: string) {
    const response: { accept: boolean; invitedBy: string } =
      JSON.parse(payload);
    const currentPlayer: Player = this.clients.find(
      (c) => c.socketID === client.id,
    );
    const invitingPlayer: Player = this.clients.find(
      (c) => c.userName === response.invitedBy,
    );

    if (!invitingPlayer) {
      this.server
        .to(currentPlayer.socketID)
        .emit('errorGameInvite', { error: 'Player has left' });
      return;
    }

    const user = await this.prisma.user.findUnique({
      where: {
        email: invitingPlayer.email,
      },
    });
    if (user.status !== 'WAITING') {
      this.server
        .to(currentPlayer.socketID)
        .emit('errorGameInvite', { error: 'Player not available anymore' });
      return;
    }

    if (response.accept) {
      client.join(response.gameID.toString());
			const gameStarted = this.gameService.joinGameAndLaunch(currentPlayer, response.gameID);
			if (gameStarted){
				this.server.to(invitingPlayer.socketID).emit("invitationAccepted");
			} else {
				this.server.to(currentPlayer.socketID).emit("errorGameInvite", {error: "Game has been deleted"});
			}
    } else {
      this.server.to(invitingPlayer.socketID).emit('invitationDeclined');
      this.gameService.deleteGame(currentPlayer.gameID);
    }
  }
  */

  @SubscribeMessage('movePaddle')
  async handleMovePaddle(
    client: Socket,
    payload: { key: string; gameID: string },
  ): Promise<object> {
    console.log("got moveP event!");
    const gameData = await this.gameService.movePaddle(client, payload);
    if (!gameData) return;
    let updateSide = '';
    console.log('game Data to sent: ', gameData);

    if (
      gameData.currentGame.leftPlayer.socketID ===
      gameData.currentPlayer.socketID
    ) {
      updateSide = 'updateLeftPaddle';
    } else {
      updateSide = 'updateRightPaddle';
    }

    this.server
      .to(gameData.currentGame.rightPlayer.socketID)
      .emit(updateSide, gameData.currentPlayer.paddlePosition);
    this.server
      .to(gameData.currentGame.leftPlayer.socketID)
      .emit(updateSide, gameData.currentPlayer.paddlePosition);
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
