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
    origin: [`${process.env.FRONTEND_URL}`, '*'],
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

  /****************************************************************************/
  /* handle connection/disconnection                                          */
  /****************************************************************************/
  async handleConnection(client: Socket) {
    console.log(`Socket: ${client.id} connected to game socket`);
    // check JWT
    const jwt = client.handshake.headers.authorization;
    let jwtData: { sub: string; email: string; iat: string; exp: string } | any;
    if (jwt === 'undefined' || jwt === null) {
      console.log('Socket: No jwt, disconnecting');
      client.disconnect();
      return;
    }
    jwtData = this.jwtService.decode(jwt);
    if (typeof jwtData !== 'object') {
      console.log(client.id, 'Socket: Bad JWT data', jwtData);
      client.disconnect();
      return;
    }

    // find the user in database
    const user = await this.prisma.user.findUnique({
      where: {
        email: jwtData.email,
      },
    });
    if (!user) {
      client.emit('accountDeleted', {
        message: 'Your account has been deleted.',
      });
      client.disconnect();
      return;
    }

    // link socket id to useremail
    await this.cacheManager.set(client.id, user.email);

    // check if player already exists in game
    const existingPlayer: string = await this.cacheManager.get(
      `game${jwtData.email}`,
    );
    if (existingPlayer) {
      let existingPlayerObject: Player = JSON.parse(existingPlayer);
      existingPlayerObject.socketID = client.id;
      await this.cacheManager.set(
        `game${jwtData.email}`,
        JSON.stringify(existingPlayerObject),
      );
      console.log(existingPlayerObject);
      console.log(
        'Socket: existing player updated: ',
        existingPlayerObject.email,
      );
      this.gameService.joinGameAndLaunch(
        existingPlayerObject,
        existingPlayerObject.gameID,
      );
      return;
    }

    // if no such player in redis, create one.
    this.gameService.createPlayer(jwtData.email, client.id, user.userName);
  }

  async handleDisconnect(client: Socket) {
    await this.cacheManager.del(client.id);
    // check if player left in game
    const playerEmail: string = await this.cacheManager.get(client.id);
    if (!playerEmail) return;
    await this.cacheManager.del(client.id);

    const existingPlayer: string = await this.cacheManager.get(
      `game${playerEmail}`,
    );
    if (!existingPlayer) return;
    const existingPlayerObject: Player = JSON.parse(existingPlayer);

    // find the user in database
    const user = await this.prisma.user.findUnique({
      where: {
        email: existingPlayerObject.email,
      },
    });
    // check the user status in database;
    if (!user) {
      console.log('user not found!');
      return;
    }
    if (user.status === 'OFFLINE') {
      this.cacheManager.del(`game${existingPlayerObject.email}`);
      return;
    } else if (user.status === 'WAITING') {
      const pendingPlayer: string =
        await this.cacheManager.get('pendingPlayer');
      if (!pendingPlayer) return;
      // check if pendingPlayer(in cache) is the waiting player(in database)
      const pendingPlayerObject: Player = JSON.parse(pendingPlayer);
      if (user.email === pendingPlayerObject.email) {
        await this.cacheManager.del('pendingPlayer');
        await this.cacheManager.del(`game${user.email}`);
      }
    } else if (user.status === 'PLAYING') {
      // wait 30 seconds, or game is lost??
      if (existingPlayerObject.gameID) {
        client.join(existingPlayerObject.gameID.toString());
      }
    }
    console.log(`Socket: ${client.id} disconnected from game socket. 0.0`);
  }

  /****************************************************************************/
  /* GAME                                                                     */
  /****************************************************************************/
  @SubscribeMessage('setCanvas')
  handleSetCanvas(client: Socket, payload: any) {
    this.gameService.setCanvas(payload);
  }

  @SubscribeMessage('findGame')
  async handleFindGame(client: Socket) {
    const currentPlayerEmail: string = await this.cacheManager.get(client.id);
    const currentPlayer: string = await this.cacheManager.get(
      `game${currentPlayerEmail}`,
    );
    if (!currentPlayer) return;
    const currentPlayerObject: Player = JSON.parse(currentPlayer);

    const startGame: [boolean, string] =
      await this.gameService.joinOrCreateGame(currentPlayerObject);
    const gameRoom: string = currentPlayerObject.gameID.toString();

    client.join(gameRoom);

    if (startGame[0]) {
      this.server.to(gameRoom).emit('endWaitingState');
    }
  }

  @SubscribeMessage('startGame')
  async handleStartGame(client: Socket, payload: Object): Promise<Object> {
    const currentPlayerEmail: string = await this.cacheManager.get(client.id);
    const currentPlayer: string = await this.cacheManager.get(
      `game${currentPlayerEmail}`,
    );
    const currentPlayerObject: Player = JSON.parse(currentPlayer);

    // probably need "client/socket id" from both client and save it into the "gamedata" object.
    console.log("Let's go!");
    console.log(currentPlayerObject);
    const gameRoom: string = currentPlayerObject.gameID.toString();
    console.log(gameRoom);

    // Move the GAME LOOP(gameInterval) here so all the event listener/emitter will stay in this gateway file
    // gameInterval will call "gameLogic" 30 times per second.
    const gameInterval = setInterval(async () => {
      const gameData = this.gameService.gameLogic(client);
      this.server.to(gameRoom).emit('updateGame', gameData);
      // also need to ubpdate the paddle for both sides.
      console.log(gameData);
      if (!gameData) {
        clearInterval(gameInterval);
        return;
      }
      if (gameData.status === GameStatus.Ended) {
        this.gameService.endGame(gameData);
        clearInterval(gameInterval);
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
  handleMovePaddle(
    client: Socket,
    payload: { key: string; gameID: string },
  ): object {
    const gameData = this.gameService.movePaddle(client, payload);
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
