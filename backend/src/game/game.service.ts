import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { SocketGateway } from "src/weksocket/socket.gateway";

class Player {
	constructor(
		public socketID: string,
		public gameID: number,
		public paddlePosition: number
	) {}
}

class Game {
	constructor (
		public gameID: number,
		public nbPlayers: number,
		public leftPlayer: Player,
		public rightPlayer: Player,
	) {}
}

@Injectable()
export class GameService {
	constructor(
		@Inject(forwardRef(() => SocketGateway))
		private readonly socketGateway: SocketGateway
	) {}

	// this should all be stored in the cache:
	private canvas: {
		canvasHeight: number,
		paddleHeight: number,
	} = {
		canvasHeight: 0,
		paddleHeight: 0,
	};
	
	private players: Player[] = [];
	private games: Game[] = [];
	private startPaddle: number;
	private gameIDcounter: number = 0;

	joinOrCreateGame (client: string) {
		const availableGame = this.games.find((game) => (game.nbPlayers === 1));
		if (availableGame) {
			const newPlayer = new Player(client, availableGame.gameID, this.startPaddle);
			this.players.push(newPlayer);
			availableGame.rightPlayer = newPlayer;
			availableGame.nbPlayers++;
		} else {
			const newPlayer = new Player(client, this.gameIDcounter, this.startPaddle);
			const newGame = new Game(this.gameIDcounter, 1, newPlayer, null);
			this.gameIDcounter++;
			this.games.push(newGame);
			this.players.push(newPlayer);
		}
	}

	setCanvas ({canvasHeight, paddleHeight}: {canvasHeight: number, paddleHeight: number}) {
		this.canvas.canvasHeight = canvasHeight;
		this.canvas.paddleHeight = paddleHeight;
		this.startPaddle = canvasHeight / 2 - paddleHeight / 2;
	}

	movePaddle (server: Server, client: Socket, payload: string) {
		const currentPlayer = this.players.find((player) => (player.socketID === client.id));
		if (!currentPlayer){
			console.log('error');
		} else {
			if (payload === 'up'){
				currentPlayer.paddlePosition = Math.max(currentPlayer.paddlePosition - 10, 0);
			} else if (payload === 'down'){
				currentPlayer.paddlePosition = Math.min(currentPlayer.paddlePosition + 10, this.canvas.canvasHeight - this.canvas.paddleHeight)
			}
			const currentGame = this.games.find((game) => (game.gameID === currentPlayer.gameID));
			if (currentGame.leftPlayer === currentPlayer) {
				server.to(currentGame.leftPlayer.socketID).emit('updateLeftPaddle', currentPlayer.paddlePosition);
				server.to(currentGame.rightPlayer.socketID).emit('updateLeftPaddle', currentPlayer.paddlePosition);
			} else {
				server.to(currentGame.leftPlayer.socketID).emit('updateRightPaddle', currentPlayer.paddlePosition);
				server.to(currentGame.rightPlayer.socketID).emit('updateRightPaddle', currentPlayer.paddlePosition);
			}
		}
	}
}