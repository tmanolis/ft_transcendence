import { Inject, Injectable, forwardRef, CACHE_MANAGER } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Cache } from 'cache-manager';
import { PrismaService } from 'nestjs-prisma';

// this should all be stored in the cache:

class Game {
  constructor(
    public gameID: number,
    public nbPlayers: number,
    public leftPlayer: {email: string, socketID: string, userName: string},
    public rightPlayer: {email: string, socketID: string, userName: string},
    public score: Record<number, number>,

  ) {}
}

interface Position {
  x: number;
  y: number;
}

@Injectable()
export class GameService {
  constructor(
		@Inject(CACHE_MANAGER) 
		private readonly cacheManager: Cache,
		private prisma: PrismaService,
) {}

  // this should all be stored in the cache:
  private canvas: {
    canvasHeight: number;
    paddleHeight: number;
  } = {
    canvasHeight: 0,
    paddleHeight: 0,
  };

  private games: Game[] = [];
  private startPaddle: number;
  private gameIDcounter: number = 0;

	async joinOrCreateGame(
		player: {email: string, socketID: string, userName: string, gameID: number}): Promise<[boolean, number]>{
		let pendingPlayer: string = await this.cacheManager.get('pendingPlayer');
		
		// Check if pending player is still waiting to start a game
		if (pendingPlayer){
			const otherPlayer = JSON.parse(pendingPlayer);
			const user = await this.prisma.user.findUnique({
				where: {
					email: otherPlayer.email,
				}
			})
			if (user.status !== 'WAITING'){
				this.cacheManager.del('pendingPlayer');
				pendingPlayer = undefined;
			}
		}

		// Matching
		if (!pendingPlayer){
			player.gameID = this.gameIDcounter;
			this.gameIDcounter++;
			this.cacheManager.set('pendingPlayer', JSON.stringify(player));
			await this.prisma.user.update({
				where: {
					email: player.email,
				}, data: {
					status: 'WAITING',
				}
			})
			return [false, player.gameID];
		} else {
			this.cacheManager.del('pendingPlayer');
			const otherPlayer = JSON.parse(pendingPlayer);
			player.gameID = otherPlayer.gameID;
			this.createGame(otherPlayer, player);
			return [true, otherPlayer.gameID];
		}
	}

	createInvitedGame(player1: {email: string, socketID: string, userName: string, gameID: number}, 
		player2: {email: string, socketID: string, userName: string, gameID: number}){
			const gameID = this.gameIDcounter;
			this.gameIDcounter++;
			player1.gameID = gameID;
			player2.gameID = gameID;
			this.createGame(player1, player2);
	}

	async createGame(player1: {email: string, socketID: string, userName: string, gameID: number}, 
		player2: {email: string, socketID: string, userName: string, gameID: number}) {
			const newGame = new Game(player1.gameID, 2, player1, player2, [0,0]);
			await this.prisma.user.updateMany({
				where: {
					email: {
						in: [newGame.leftPlayer.email, newGame.rightPlayer.email],
					},}, data : {
					status: 'PLAYING',
				},
			})
			this.games.push(newGame);
	}

	endGame(){
		// change status players to ONLINE
		// save game data to prisma both players
		// delete game from game array
	}

	deleteGame(gameID: number){

	}

  setCanvas({
    canvasHeight,
    paddleHeight,
  }: {
    canvasHeight: number;
    paddleHeight: number;
  }) {
    this.canvas.canvasHeight = canvasHeight;
    this.canvas.paddleHeight = paddleHeight;
    this.startPaddle = canvasHeight / 2 - paddleHeight / 2;
  }

  // movePaddle(client: Socket, payload: string) {
  //   const currentPlayer = this.players.find(
  //     (player) => player.socketID === client.id,
  //   );
  //   if (!currentPlayer) {
  //     console.log('error');
  //     return;
  //   } else {
  //     if (!currentPlayer.paddlePosition) {
  //       console.log('no pad pos');
  //       currentPlayer.paddlePosition = 50;
  //     }
  //     if (payload === 'up') {
  //       currentPlayer.paddlePosition = Math.max(
  //         currentPlayer.paddlePosition - 10,
  //         0,
  //       );
  //     } else if (payload === 'down') {
  //       console.log('position: ', currentPlayer.paddlePosition);
  //       currentPlayer.paddlePosition = currentPlayer.paddlePosition + 10;
  //       // Math.min(currentPlayer.paddlePosition + 10, this.canvas.canvasHeight - this.canvas.paddleHeight)
  //       console.log('position: ', currentPlayer.paddlePosition);
  //     }
  //     const currentGame = this.games.find(
  //       (game) => game.gameID === currentPlayer.gameID,
  //     );
  //     return { currentGame: currentGame, currentPlayer: currentPlayer };
  //   }
  // }

  gameLogic(client: Socket, gameData: Position) {
    if (gameData.x === -99 && gameData.y === -99) {
      return { x: 50, y: 50 };
    } else {
      return { x: gameData.x + 3, y: gameData.y + 3 };
    }
  }

  async gameLoop(body: any, client: Socket) {
    let randX = Math.floor(Math.floor((Math.random() - 0.5) * 100) * 0.1);
    let randY = Math.floor(Math.floor((Math.random() - 0.5) * 100) * 0.1);
    if (randX < 3 && randX >= 0) {
      randX += 3;
    }
    if (randX > -3 && randX <= 0) {
      randX -= 3;
    }
    let direction = { x: randX, y: randY };

    const gameInterval = setInterval(async () => {
      //      console.log("interval called!!");
      const gameData: string = await this.cacheManager.get(body.gameID);
      console.log(gameData);
      return { x: 1, y: 2 };
      if (gameData) {
        const gameDataJSON = JSON.parse(gameData);

        let x = gameDataJSON.ballPosition.x;
        let y = gameDataJSON.ballPosition.y;
        if (y >= 480 || y <= 15) {
          direction.y *= -1;
        }
        console.log(x, y);
        console.log(gameDataJSON.leftUser);
        if (
          x <= 20 &&
          y >= gameDataJSON.leftUser.position.y - 50 &&
          y <= gameDataJSON.leftUser.position.y + 50
        ) {
          direction.x *= -1;
        }

        if (x > 710 || x < 10) {
          clearInterval(gameInterval);
          gameDataJSON.ballPosition.x = 360;
          gameDataJSON.ballPosition.y = 360;
          await this.cacheManager.del(body.gameID);
          await this.cacheManager.set(
            body.gameID,
            JSON.stringify(gameDataJSON),
          );
        }

        x += direction.x;
        y += direction.y;
        gameDataJSON.ballPosition.x = x;
        gameDataJSON.ballPosition.y = y;
        await this.cacheManager.del(body.gameID);
        await this.cacheManager.set(body.gameID, JSON.stringify(gameDataJSON));
      }
    }, 1000 / 30);
  }
}
