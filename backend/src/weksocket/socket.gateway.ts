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
		this.gameService.joinOrCreateGame(client.id);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
		this.clients = this.clients.filter((socket) => socket.id !== client.id);
	}

	@SubscribeMessage('setCanvas')
	handleSetCanvas(client: Socket, payload: any){
		this.gameService.setCanvas(payload);
	}

	@SubscribeMessage('movePaddle')
	handleMovePaddle(client: Socket, payload: string) {
		this.gameService.movePaddle(this.server, client, payload);
	}
}