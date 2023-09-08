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
import { PrismaService } from 'nestjs-prisma';
import { Cache } from 'cache-manager';
import { GameService } from '../game/game.service';
import { Inject, CACHE_MANAGER } from '@nestjs/common';
// Will implement latter
// import { ChatService } from './chat/chat.service';

class Client {
  constructor(
    public email: string,
    public socketID: string,
		public userName: string,
		public gameID: number,
  ) {}
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8080'],
  },
})
export class SocketGateway implements OnGatewayConnection {
  constructor(
		@Inject (CACHE_MANAGER)
		private readonly cacheManager: Cache,
    private readonly gameService: GameService,
    private readonly jwtService: JwtService,
		private prisma: PrismaService,
  ) {}
  @WebSocketServer()
  server: Server;
  private clients: Client[] = [];

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

		if (typeof jwtData === 'object') {
			const existingClient = this.clients.find((c) => c.email === jwtData.email);
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
				const newClient = new Client(jwtData.email, client.id, user.userName, null);
				this.clients.push(newClient);
				console.log('creating new client:', newClient.email);
		}}
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
			} else if (user.status === 'WAITING'){
				const pendingPlayer: string = await this.cacheManager.get('pendingPlayer');
				if (pendingPlayer){
					const pendingPlayerObject: {email: string, socketID: string, userName: string, gameID: number} = JSON.parse(pendingPlayer);
					if (user.email === pendingPlayerObject.email){
						await this.cacheManager.del('pendingPlayer');
				}
				}
			}
		}
    console.log(client.id, ' disconnected from generic socket. 0.0');
  }

  /****************************************************************************/
  /* GAME                                                                     */
  /****************************************************************************/
  @SubscribeMessage('playGame')
  async handlePlayGame(client: Socket) {
		const currentPlayer: Client = this.clients.find((c) => c.socketID === client.id);
		const startGame: [boolean, number] = await this.gameService.joinOrCreateGame(currentPlayer);
		const gameRoom: string = currentPlayer.gameID.toString();

		client.join(gameRoom);

		// check if already playing before entering game
		if (startGame[0]){
			this.server.to(gameRoom).emit('endWaitingState');
		}
  }

	@SubscribeMessage('invitePlayer')
	async handleInvitePlayer(client: Socket, payload: { inviting: string }) {
		const currentPlayer: Client = this.clients.find((c) => c.socketID === client.id);	
		const invitedPlayer: Client = this.clients.find((c) => c.userName === payload.inviting);

		// check if player is found, and is available:
		if (!invitedPlayer) {
			this.server.to(client.id).emit("errorGameInvite", {error: "Player not found"});
			return;
		} 

		const user = await this.prisma.user.findUnique({
			where: {
				email: invitedPlayer.email,
			},
		})
		if (user.status !== "ONLINE"){
			this.server.to(client.id).emit("errorGameInvite", {error: "Player not available"});
			return;
		}
		this.gameService.createInvitedGame(currentPlayer, invitedPlayer);
		const gameID = currentPlayer.gameID.toString();
		client.join(gameID);
		this.server.to(invitedPlayer.socketID).emit("gameInvite", {invitedBy: currentPlayer.userName});
	}

	@SubscribeMessage('respondToInvite')
	async handleRespondToInvite(client: Socket, payload: { accept: boolean, invitedBy: string }) {
		const currentPlayer: Client = this.clients.find((c) => c.socketID === client.id);	
		const invitingPlayer: Client = this.clients.find((c) => c.userName === payload.invitedBy);
		const gameID = currentPlayer.gameID.toString();

		if (payload.accept) {
			client.join(gameID);
			this.server.to(invitingPlayer.socketID).emit("Invitation accepted");		
		} else {
			this.server.to(invitingPlayer.socketID).emit("Invitation declined");
			this.gameService.deleteGame(currentPlayer.gameID)
		}
	}


  // @SubscribeMessage('startGame')
  // handleStartGame(client: Socket, payload: Object): Object {
  //   // probably need "client/socket id" from both client and save it into the "gamedata" object.
  //   console.log("Let's go!");
  //   let gameData = { x: -99, y: -99 };
  //   console.log(gameData);

  //   // Move the GAME LOOP(gameInterval) here so all the event listener/emitter will stay in this gateway file
  //   // gameInterval will call "gameLogic" 30 times per second.
  //   const gameInterval = setInterval(async () => {
  //     gameData = this.gameService.gameLogic(client, gameData);
  //     this.server.to(client.id).emit('updateBall', gameData);
  //     // also need to ubpdate the paddle for both sides.
  //   }, 1000 / 30);

  //   return { event: 'start game', socketID: client.id };
  // }

  // @SubscribeMessage('movePaddle')
  // handleMovePaddle(client: Socket, payload: string): Object {
  //   const gameData = this.gameService.movePaddle(client, payload);
  //   console.log(gameData);
  //   this.server
  //     .to(gameData.currentGame.rightPlayer.socketID)
  //     .emit('updateRightPaddle', gameData.currentPlayer.paddlePosition);
  //   console.log(payload);
  //   console.log('Paddle movinnnnn!!!');
  //   return { event: 'player paddle move', socketID: client.id };
  // }

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
