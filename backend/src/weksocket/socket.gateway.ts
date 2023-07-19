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

export class SocketGateway {

	constructor(private readonly gameService: GameService) {}

	@WebSocketServer()
	server: Server;

	@SubscribeMessage('movePaddle')
	handleMovePaddle(client: Socket, payload: any) {
		if (payload.direction === 'up'){
			this.gameService.movePaddleUp(payload);
		} else if (payload.direction === 'down'){
			this.gameService.movePaddleDown(payload);
		}

		const leftPaddleY = this.gameService.getLeftPaddleY();

		this.server.emit("updatePaddlePosition", {leftPaddleY});
		
	}
}