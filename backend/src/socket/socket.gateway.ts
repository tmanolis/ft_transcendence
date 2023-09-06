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

import { GameService } from '../game/game.service';
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
		const startGame: boolean = this.gameService.joinOrCreateGame(currentPlayer);
		const gameRoom: string = currentPlayer.gameID.toString();

		client.join(gameRoom);
		
		await this.prisma.user.update({
			where: {
				email: currentPlayer.email,
			}, data : {
				status: 'PLAYING'
			}
		})

		if (startGame){
			// this.server.to(currentPlayer.socketID).emit('endWaitingState');

			this.server.to(gameRoom).emit('endWaitingState');
		}
  }

	@SubscribeMessage('invitePlayer')
	async handleInvite(client: Socket) {
		const currentPlayer: Client = this.clients.find((c) => c.socketID === client.id);
    // COMMENTING CODE PARTLY, BECAUSE I DON'T KNOW HOW I WILL RECEIVE INVITED USER
		
		// const otherPlayer: Client = this.clients.find((c) => c.userName === client.invite);

		// check if player is found, and is available:
		// if (!otherPlayer) {
		// 	client.emit("errorGameInvite", {error: "Player not found"});
		// 	return;
		// } else {
		// 	const user = await this.prisma.user.findUnique{
		// 		where: {
		// 			email: otherPlayer.email,
		// 		},
		// 	}
		// 	if (user.status !== "ONLINE"){
		// 		client.emit("errorGameInvite", {error: "Player not available"});
		// 		return;
		// 	}
		// }

		// this.gameService.createGame(currentPlayer, otherPlayer);

		// update status of both players to 'PLAYING'
		await this.prisma.user.update({
			where: {
				email: currentPlayer.email,
			}, data : {
				status: 'PLAYING'
			}
		});
		// await this.prisma.user.update({
		// 	where: {
		// 		email: otherPlayer.email,
		// 	}, data : {
		// 		status: 'PLAYING'
		// 	}
		// });

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
