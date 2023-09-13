import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { Cache } from 'cache-manager';
import { GameService } from '../game/game.service';
import { Inject, CACHE_MANAGER } from '@nestjs/common';
import { Player } from '../dto/game.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8080'],
  },
	namespace: 'game',
})

export class GameGateway implements OnGatewayConnection {
  constructor(
    @Inject (CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly gameService: GameService,
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  @WebSocketServer()
  server: Server;
  private clients: Player[] = [];

  /****************************************************************************/
  /* handle connection/disconnection                                          */
  /****************************************************************************/
  async handleConnection(client: Socket) {
    const jwt = client.handshake.headers.authorization;
    let jwtData: { sub: string; email: string; iat: string; exp: string } | any;

    if (jwt === 'undefined' || jwt === null){
      console.log('No jwt, disconnecting');
      client.disconnect();
      return;
    } else {
      jwtData = this.jwtService.decode(jwt);
    }
  
    if (typeof jwtData !== 'object'){
      console.log(client.id, 'JWT data is not an object:', jwtData);
      client.disconnect();
			return;
    }

		const existingClient:Player = this.clients.find((c) => c.email === jwtData.email);
		if (existingClient){
			existingClient.socketID = client.id;
			console.log('updating existing client:', existingClient.email);
		} else {
			const user = await this.prisma.user.findUnique({
				where: {
					email: jwtData.email,
				}
			})
			
			if (!user){
				client.emit('accountDeleted', { message: 'Your account has been deleted.' });
				client.disconnect();
				return;
			}

			const newPlayer = new Player(null, jwtData.email, client.id, user.userName, 0);
			this.clients.push(newPlayer);
			console.log('creating new client/player:', newPlayer.email);
		}
	}

  async handleDisconnect(client: Socket) {
    const existingClient = this.clients.find((c) => c.socketID === client.id);
    if (existingClient){
      const user = await this.prisma.user.findUnique({
        where: {
          email: existingClient.email,
        },
      });
      if (user.status === 'OFFLINE'){
        this.clients = this.clients.filter((c) => c.email !== existingClient.email);
				return ;
      } else if (user.status === 'WAITING'){
        const pendingPlayer: string = await this.cacheManager.get('pendingPlayer');
        if (pendingPlayer){
          const pendingPlayerObject: {email: string, socketID: string, userName: string, gameID: number} = JSON.parse(pendingPlayer);
          if (user.email === pendingPlayerObject.email){
            await this.cacheManager.del('pendingPlayer');
       		}
      	}} else if (user.status === 'PLAYING') {
					// wait 30 seconds, or game is lost??
					if (existingClient.gameID){
						client.join(existingClient.gameID.toString())
					}
				}
    	}
    console.log(client.id, ' disconnected from generic socket. 0.0');
  }

  /****************************************************************************/
  /* GAME                                                                     */
  /****************************************************************************/
  @SubscribeMessage('setCanvas')
  handleSetCanvas(client: Socket, payload: any) {
    console.log(payload);
    this.gameService.setCanvas(payload);
  }

  @SubscribeMessage('playGame')
  async handlePlayGame(client: Socket) {
    const currentPlayer: Player = this.clients.find((c) => c.socketID === client.id);
    const startGame: [boolean, number] = await this.gameService.joinOrCreateGame(currentPlayer);
    const gameRoom: string = currentPlayer.gameID.toString();

    client.join(gameRoom);

    if (startGame[0]){
      this.server.to(gameRoom).emit('endWaitingState');
    }
  }

  @SubscribeMessage('startGame')
  async handleStartGame(client: Socket, payload: Object): Promise<Object> {
		const currentPlayer: Player = this.clients.find((c) => c.socketID === client.id);

		// check if player is in a game already
		if (currentPlayer.gameID){
			return;
		}

    // probably need "client/socket id" from both client and save it into the "gamedata" object.
    console.log("Let's go!");
		const gameRoom: string = currentPlayer.gameID.toString();

    // Move the GAME LOOP(gameInterval) here so all the event listener/emitter will stay in this gateway file
    // gameInterval will call "gameLogic" 30 times per second.
    const gameInterval = setInterval(async () => {
      const gameData = this.gameService.gameLogic(client);
			this.server.to(gameRoom).emit('updateGame', gameData);
      // also need to ubpdate the paddle for both sides.
      if (gameData.status === 'ended') {
        clearInterval(gameInterval);
      }
    }, 1000 / 30);
    
    return { event: 'start game', socketID: client.id };
  }

	@SubscribeMessage('invitePlayer')
  async handleInvitePlayer(client: Socket, payload: { inviting: string } ) {
    const currentPlayer: Player = this.clients.find((c) => c.socketID === client.id);  
    const invitedPlayer: Player = this.clients.find((c) => c.userName === payload.inviting);

    // check if player is found, and is available:
    if (!invitedPlayer) {
      this.server.to(client.id).emit("errorGameInvite", {error: "Player not found"});
      return;
    };

		console.log(invitedPlayer);
    const user = await this.prisma.user.findUnique({
      where: {
        email: invitedPlayer.email,
      },
    })
    if (user.status !== "ONLINE"){
			console.log('not available', user);
      this.server.to(client.id).emit("errorGameInvite", {error: "Player not available"});
      return;
    };

		this.gameService.createWaitingGame(currentPlayer);
		console.log('player before emit', currentPlayer);
    const gameID = currentPlayer.gameID.toString();
    client.join(gameID);
    this.server.to(invitedPlayer.socketID).emit("gameInvite", {invitedBy: currentPlayer.userName});
  }

  @SubscribeMessage('respondToInvite')
  async handleRespondToInvite(client: Socket, payload: string) {
		const response: { accept: boolean, invitedBy: string } = JSON.parse(payload);
    const currentPlayer: Player = this.clients.find((c) => c.socketID === client.id);  
    const invitingPlayer: Player = this.clients.find((c) => c.userName === response.invitedBy);

		if (!invitingPlayer){
			this.server.to(currentPlayer.socketID).emit("errorGameInvite", {error: "Player has left"});
			return;
		}

		const user = await this.prisma.user.findUnique({
      where: {
        email: invitingPlayer.email,
      },
    })
		if (user.status !== "WAITING"){
			this.server.to(currentPlayer.socketID).emit("errorGameInvite", {error: "Player not available anymore"});		
			return;
		};

		const gameID = invitingPlayer.gameID.toString();
		if (!gameID){client.id
			this.server.to(currentPlayer.socketID).emit("errorGameInvite", {error: "Game has been deleted"});
			return;		
		}

    if (response.accept) {
      client.join(gameID);
			this.gameService.joinGameAndLaunch(currentPlayer, invitingPlayer.gameID);
      this.server.to(invitingPlayer.socketID).emit("invitationAccepted");
    } else {
      this.server.to(invitingPlayer.socketID).emit("invitationDeclined");
      this.gameService.deleteGame(currentPlayer.gameID)
    }
  }

  @SubscribeMessage('movePaddle')
  handleMovePaddle(client: Socket, payload: Object): Object {
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
}
