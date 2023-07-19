import { Injectable } from "@nestjs/common";

@Injectable()
export class GameService {
	private newPosition = 0;

	movePaddleUp (payload: any) {
		console.log('blaaaaaa');
		console.log('initial position up', payload.leftPaddleY);
		this.newPosition = Math.max(payload.leftPaddleY - 10, 0);
		console.log('new position down', payload.leftPaddleY);
		console.log('up');
	}

	movePaddleDown (payload: any) {
		console.log('initial position down', payload.leftPaddleY);
		this.newPosition = Math.min(payload.leftPaddleY + 10, payload.canvasHeight - payload.paddleHeight)
		console.log('new position down', payload.leftPaddleY);
		console.log('down');
	}

	getLeftPaddleY(): number {
		console.log('returning paddle position', this.newPosition);
		return this.newPosition;
	}

}