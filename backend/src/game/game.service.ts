import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { SocketGateway } from "src/weksocket/socket.gateway";

@Injectable()
export class GameService {
	constructor(
		@Inject(forwardRef(() => SocketGateway))
		private readonly socketGateway: SocketGateway
	) {}

	private canvas: {
		canvasHeight: number,
		paddleHeight: number,
	}

	private leftPaddleY: number;

	setCanvas ({canvasHeight, paddleHeight}: {canvasHeight: number, paddleHeight: number}) {
		this.canvas.canvasHeight = canvasHeight;
		this.canvas.paddleHeight = paddleHeight;
		this.leftPaddleY = canvasHeight / 2 - paddleHeight / 2;
	}

	movePaddleUp (payload: any) {
		console.log(payload);
		Math.max(this.leftPaddleY - 10, 0);
		return this.leftPaddleY;
	}

	movePaddleDown (payload: any) {
		const newPosition = Math.min(payload.leftPaddleY + 10, payload.canvasHeight - payload.paddleHeight)
		return newPosition
	}
}