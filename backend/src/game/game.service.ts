import { Inject, Injectable, forwardRef, CACHE_MANAGER } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Cache } from 'cache-manager';

import { Game } from '../dto/game.dto';
import { Player } from '../dto/game.dto';

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
    const availableGame = this.games.find((game) => game.nbPlayers === 1);
    console.log('the available game: ', availableGame);
    if (availableGame) {
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
      const newPlayer = new Player(
        client,
        this.gameIDcounter,
        this.startPaddle,
      );
      const newGame = new Game(
        this.gameIDcounter,
        1,
        newPlayer,
        null,
        [0, 0],
        {
          x: 400,
          y: 400,
        },
        {
          x: 7,
          y: 7,
        },
        Math.random() * Math.PI * 2,
        'playig',
      );
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

    console.log(currentPlayer);

    if (!currentPlayer) {
      console.log('error');
      return;
    } else {
      if (!currentPlayer.paddlePosition) {
        console.log('no pad pos');
        currentPlayer.paddlePosition = 165;
      }
      if (payload === 'up') {
        if (currentPlayer.paddlePosition - 5 >= 0) {
          currentPlayer.paddlePosition = currentPlayer.paddlePosition - 5;
        }
      } else if (payload === 'down') {
        if (currentPlayer.paddlePosition + 5 < 325) {
          currentPlayer.paddlePosition = currentPlayer.paddlePosition + 5;
        }
      }

      const currentGame = this.games.find(
        (game) => game.gameID === currentPlayer.gameID,
      );
      return { currentGame: currentGame, currentPlayer: currentPlayer };
    }
  }

  gameLogic(client: Socket) {
    const currentPlayer = this.players.find(
      (player) => player.socketID === client.id,
    );
    const currentGame = this.games.find(
      (game) => game.gameID === currentPlayer.gameID,
    );

    if (!currentGame) {
      return ;
    }

    if (currentGame.ballPosition.x <= 55 && 
      (currentGame.ballPosition.y / 2 - currentGame.leftPlayer.paddlePosition > 0) &&
      (currentGame.ballPosition.y / 2 - currentGame.leftPlayer.paddlePosition < 75)) {
      currentGame.ballDirection.x *= -1;
    }

    if (currentGame.ballPosition.x >= 745 && 
      (currentGame.ballPosition.y / 2 - currentGame.rightPlayer.paddlePosition > 0) &&
      (currentGame.ballPosition.y / 2 - currentGame.rightPlayer.paddlePosition < 75)) {
      currentGame.ballDirection.x *= -1;
    }

    if (currentGame.ballPosition.y < 3 || currentGame.ballPosition.y >= 797) {
      currentGame.ballDirection.y *= -1;
    }

    currentGame.ballPosition.x += Math.cos(currentGame.ballAngle) * currentGame.ballDirection.x;
    currentGame.ballPosition.y += Math.sin(currentGame.ballAngle) * currentGame.ballDirection.y;

    if (currentGame.ballPosition.x > 780 ) {
      currentGame.ballPosition.x = 400;
      currentGame.ballPosition.y = 400;
      currentGame.score[0] += 1;
      currentGame.ballAngle = Math.random() * Math.PI * 2;
    }

    if (currentGame.ballPosition.x <= 20) {
      currentGame.ballPosition.x = 400;
      currentGame.ballPosition.y = 400;
      currentGame.score[1] += 1;
      currentGame.ballAngle = Math.random() * Math.PI * 2;
    }

    if (currentGame.score[0] === 11 || currentGame.score[1] === 11) {
      console.log("end");
      currentGame.status = 'ended';
    }

    return currentGame;
  }

/*
  async getGameDataFromCache(gameID: string): Object {
    const gameData: string = await this.cacheManager.get(body.gameID);
    if (gameData) {
      const gameDataJSON = JSON.parse(gameData);
      return gameDataJSON;
    }
    return null;
  }

  async setGameDataToCache(gameID: string, newGameData: Object): void {
    const gameData: string = await this.cacheManager.get(body.gameID);
    if (gameData) {
      await this.cacheManager.del(body.gameID);
      await this.cacheManager.set(
        body.gameID,
        JSON.stringify(gameDataJSON),
      );
    }
  }
*/

}
