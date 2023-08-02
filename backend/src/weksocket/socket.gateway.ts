import { Inject, forwardRef } from "@nestjs/common";
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { GameService } from "src/game/game.service";

@WebSocketGateway({
	cors: true,
})

export class SocketGateway implements OnGatewayConnection{

	constructor(
		@Inject(forwardRef(() => GameService))
		private readonly gameService: GameService
	) {}

	private clients: Socket[] = []; 

	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
		this.clients.push(client);		
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
		this.clients = this.clients.filter((socket) => socket.id !== client.id);
	}

	@SubscribeMessage('setCanvas')
	handleSetCanvas(payload: any){
		console.log('blub', payload);
		// this.gameService.setCanvas(payload);
	}

	@SubscribeMessage('movePaddle')
	handleMovePaddle(payload: string) {
		console.log(payload);
		let updatedPaddle: number;
		if (payload === 'up'){
			updatedPaddle = this.gameService.movePaddleUp(payload);
		} else if (payload === 'down'){
			updatedPaddle = this.gameService.movePaddleDown(payload);
		}

		console.log('sending updated paddle position: ', updatedPaddle);
		this.server.emit("updatePaddlePosition", updatedPaddle);
	}
}