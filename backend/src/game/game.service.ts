import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { SocketGateway } from "src/weksocket/socket.gateway";

@Injectable()
export class GameService {
	constructor(
		@Inject(forwardRef(() => SocketGateway))
		private readonly socketGateway: SocketGateway
	) {}

	private canvas: {
		canvasHeight: number;
		paddleHeight: number;
	  } = {
		canvasHeight: 0,
		paddleHeight: 0,
	  };
	private leftPaddleY: number = 0;

	setCanvas ({canvasHeight, paddleHeight}: {canvasHeight: number, paddleHeight: number}) {
		this.canvas.canvasHeight = canvasHeight;
		this.canvas.paddleHeight = paddleHeight;
		this.leftPaddleY = canvasHeight / 2 - paddleHeight / 2;
	}

	movePaddleUp () {
		this.leftPaddleY = Math.max(this.leftPaddleY - 10, 0);
		return this.leftPaddleY;
	}

	movePaddleDown () {
		this.leftPaddleY = Math.min(this.leftPaddleY + 10, this.canvas.canvasHeight - this.canvas.paddleHeight)
		return this.leftPaddleY;
	}
}