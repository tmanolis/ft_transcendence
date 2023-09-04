import { Inject, Injectable, forwardRef, CACHE_MANAGER } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Cache } from 'cache-manager';

// this should all be stored in the cache:
class Player {
  constructor(
    public socketID: string,
    public gameID: number,
    public paddlePosition: number,
  ) {}
}

class Game {
  constructor(
    public gameID: number,
    public nbPlayers: number,
    public leftPlayer: Player,
    public rightPlayer: Player,
    public score: Record<number, number>,
  ) {}
}

interface Position {
  x: number;
  y: number;
}

@Injectable()
export class GameService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  // this should all be stored in the cache:
  private canvas: {
    canvasHeight: number;
    paddleHeight: number;
  } = {
    canvasHeight: 0,
    paddleHeight: 0,
  };

  private players: Player[] = [];
  private games: Game[] = [];
  private startPaddle: number = 165;
  private gameIDcounter: number = 0;

  joinOrCreateGame(client: string) {
    console.log(this.games);
    const availableGame = this.games.find((game) => game.nbPlayers === 1);
    console.log('the available game: ', availableGame);
    if (availableGame) {
      console.log('canvas data: ', this.canvas);
      const newPlayer = new Player(
        client,
        availableGame.gameID,
        this.startPaddle,
      );
      this.players.push(newPlayer);
      availableGame.rightPlayer = newPlayer;
      availableGame.nbPlayers++;
      return [
        availableGame.leftPlayer.socketID,
        availableGame.rightPlayer.socketID,
      ];
    } else {
      console.log('canvas data: ', this.canvas);
      const newPlayer = new Player(
        client,
        this.gameIDcounter,
        this.startPaddle,
      );
      const newGame = new Game(this.gameIDcounter, 1, newPlayer, null, [0, 0]);
      this.gameIDcounter++;
      this.games.push(newGame);
      this.players.push(newPlayer);
    }
  }

  initGame(client: string) {}

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

  movePaddle(client: Socket, payload: Object) {
    const currentPlayer = this.players.find(
      (player) => player.socketID === client.id,
    );
    if (!currentPlayer) {
      console.log('error');
      return;
    } else {
      if (!currentPlayer.paddlePosition) {
        console.log('no pad pos');
        currentPlayer.paddlePosition = 165;
      }
      if (payload === 'up') {
        if (currentPlayer.paddlePosition - 10 >= 0) {
          currentPlayer.paddlePosition = Math.max(
            currentPlayer.paddlePosition - 10,
            0,
          );
        }
      } else if (payload === 'down') {
        if (currentPlayer.paddlePosition + 10 < 325) {
          console.log('position: ', currentPlayer.paddlePosition);
          currentPlayer.paddlePosition = currentPlayer.paddlePosition + 10;
          // Math.min(currentPlayer.paddlePosition + 10, this.canvas.canvasHeight - this.canvas.paddleHeight)
          console.log('position: ', currentPlayer.paddlePosition);
        }
      }
      const currentGame = this.games.find(
        (game) => game.gameID === currentPlayer.gameID,
      );
      return { currentGame: currentGame, currentPlayer: currentPlayer };
    }
  }

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
