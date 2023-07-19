import { OnModuleInit } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { GameService } from "src/game/game.service";

@WebSocketGateway({
		cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
			'http://localhost:8080',
    ],
  },
})

export class SocketGateway implements OnModuleInit {

	constructor(private readonly gameService: GameService) {}

	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on('connection', (socket) => {
		}) 
	}

	@SubscribeMessage('movePaddle')
	handleMovePaddle(client: Socket, payload: any) {
		const direction = payload.direction;

		if (direction === 'up'){
			this.gameService.movePaddleUp();
		} else if (direction === 'down'){
			this.gameService.movePaddleDown();
		}
		
	}
}