import { Injectable } from "@nestjs/common";

@Injectable()
export class GameService {

	movePaddleUp () {
		console.log('up');
	}

	movePaddleDown () {
		console.log('down');
	}
}