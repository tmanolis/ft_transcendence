import { Inject, OnModuleInit, forwardRef } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { GameService } from "src/game/game.service";

@WebSocketGateway({
	cors: true,
})

export class SocketGateway implements OnModuleInit {

	constructor(
		@Inject(forwardRef(() => GameService))
		private readonly gameService: GameService
	) {}

	private clients: Socket[] = []; 

	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log('Connected:');
			console.log(socket.id);

			this.clients.push(socket);
		})
	}

	@SubscribeMessage('setCanvas')
	handleSetCanvas(payload: any){
		console.log('blub', payload);
		// this.gameService.setCanvas(payload);
	}

	@SubscribeMessage('movePaddle')
	handleMovePaddle(payload: any) {
		console.log('movepaddle payload', payload);
		let updatedPaddle;
		if (payload.direction === 'up'){
			updatedPaddle = this.gameService.movePaddleUp(payload);
		} else if (payload.direction === 'down'){
			updatedPaddle = this.gameService.movePaddleDown(payload);
		}

		this.server.emit("updatePaddlePosition", updatedPaddle);
	}
}