import { Inject, OnModuleInit, forwardRef } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { GameService } from "src/game/game.service";

@WebSocketGateway({
	cors: true
})

export class SocketGateway implements OnModuleInit {

	constructor(
		@Inject(forwardRef(() => GameService))
		private readonly gameService: GameService
	) {}

	private leftPaddleY = 0;
	private clients: Socket[] = []; 

	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket.id);
			console.log('Connected');

			this.clients.push(socket);
		})
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log('client connected: ', client);
	}

	@SubscribeMessage('movePaddle')
	handleMovePaddle(client: Socket, payload: any) {	
		if (payload.direction === 'up'){
			this.leftPaddleY = this.gameService.movePaddleUp(payload);
		} else if (payload.direction === 'down'){
			this.leftPaddleY = this.gameService.movePaddleDown(payload);
		}

		this.server.emit("updatePaddlePosition", { leftPaddleY: this.leftPaddleY });
	}
}