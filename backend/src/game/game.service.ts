import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { SocketGateway } from "src/weksocket/socket.gateway";

@Injectable()
export class GameService {
	constructor(
		@Inject(forwardRef(() => SocketGateway))
		private readonly socketGateway: SocketGateway
	) {}

	movePaddleUp (payload: any) {
		const newPosition = Math.max(payload.leftPaddleY - 10, 0);
		return newPosition;
	}

	movePaddleDown (payload: any) {
		const newPosition = Math.min(payload.leftPaddleY + 10, payload.canvasHeight - payload.paddleHeight)
		return newPosition
	}
}