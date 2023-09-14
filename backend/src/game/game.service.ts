import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Socket } from 'socket.io';
import { Cache } from 'cache-manager';
import { PrismaService } from 'nestjs-prisma';

import { Game } from '../dto/game.dto';
import { Player } from '../dto/game.dto';

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
  private startPaddle: number = 165;

  /****************************************************************************/
  /* GAME INIT                                                                */
  /****************************************************************************/

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

  async joinOrCreateGame(player: Player): Promise<[boolean, string]> {
    let pendingPlayer: string = await this.cacheManager.get('pendingPlayer');

    // Check if pending player exists, is available and is not current player
    if (pendingPlayer) {
      const otherPlayer = JSON.parse(pendingPlayer);
      const user = await this.prisma.user.findUnique({
        where: {
          email: otherPlayer.email,
        },
      });
      if (user.status !== 'WAITING') {
        this.cacheManager.del('pendingPlayer');
        pendingPlayer = undefined;
      }
      if (otherPlayer.userName === player.userName) {
        this.cacheManager.set('pendingPlayer', JSON.stringify(player));
        return [false, player.gameID];
      }
    }

    // Matching
    if (!pendingPlayer && player) {
      this.createWaitingGame(player);
      this.cacheManager.set('pendingPlayer', JSON.stringify(player));
      return [false, player.gameID];
    } else {
      const otherPlayer = JSON.parse(pendingPlayer);
      this.cacheManager.del('pendingPlayer');
      const gameID = otherPlayer.gameID;
      this.joinGameAndLaunch(player, gameID);
      return [true, otherPlayer.gameID];
    }
  }

  async createWaitingGame(player: Player) {
    const gameID = player.socketID;
    const newGame = new Game(
      gameID,
      1,
      player,
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
      'playing',
    );
    player.gameID = gameID;
    console.log('player in service: ', player);
    try {
      await this.prisma.user.update({
        where: {
          email: player.email,
        },
        data: {
          status: 'WAITING',
        },
      });
    } catch (err) {
      console.log(err);
    }
    this.games.push(newGame);
    console.log('game created with id', gameID);
  }

  async joinGameAndLaunch(player: Player, gameID: string) {
    const game = this.games.find((game) => game.gameID === gameID);
    console.log('join and launch', game);
    if (game) {
      player.gameID = gameID;
      this.cacheManager.set(`game${player.email}`, JSON.stringify(player));
      game.rightPlayer = player;
      await this.prisma.user.updateMany({
        where: {
          email: {
            in: [game.leftPlayer.email, game.rightPlayer.email],
          },
        },
        data: {
          status: 'PLAYING',
        },
      });
      console.log(game);
      console.log('starting game', gameID);
    } else {
      console.log('game not found with id', gameID);
    }
  }

  /****************************************************************************/
  /* GAME END                                                                 */
  /****************************************************************************/

  async endGame(gameID: string) {
    const game = this.games.find((game) => game.gameID === gameID);

    const leftPlayer = await this.prisma.user.findUnique({
      where: {
        email: game.leftPlayer.email,
      },
    });
    const rightPlayer = await this.prisma.user.findUnique({
      where: {
        email: game.rightPlayer.email,
      },
    });

    const winner = game.score[0] > game.score[1] ? leftPlayer : rightPlayer;
    const loser = game.score[1] > game.score[0] ? leftPlayer : rightPlayer;

    await this.prisma.game.create({
      data: {
        players: {
          connect: [{ email: leftPlayer.email }, { email: rightPlayer.email }],
        },
        winner: {
          connect: { id: winner.id },
        },
        loser: {
          connect: { id: loser.id },
        },
      },
    });

    this.deleteGame(gameID);
  }

  async deleteGame(gameID: string) {
    const game = this.games.find((game) => game.gameID === gameID);

    game.leftPlayer.gameID = null;
    game.rightPlayer.gameID = null;

    await this.prisma.user.updateMany({
      where: {
        email: {
          in: [game.leftPlayer.email, game.rightPlayer.email],
        },
      },
      data: {
        status: 'ONLINE',
      },
    });

    this.games = this.games.filter((g) => g.gameID !== gameID);
  }

  /****************************************************************************/
  /* GAMEPLAY                                                                 */
  /****************************************************************************/

  movePaddle(client: Socket, payload: Object) {
    const currentGame = this.games.find(
      (game) =>
        game.leftPlayer.socketID === client.id ||
        game.rightPlayer.socketID === client.id,
    );

    const currentPlayer =
      currentGame.leftPlayer.socketID === client.id
        ? currentGame.leftPlayer
        : currentGame.rightPlayer;

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

  gameLogic(client: Socket): Game {
    const currentGame = this.games.find(
      (game) =>
        game.leftPlayer.socketID === client.id ||
        game.rightPlayer.socketID === client.id,
    );

    if (!currentGame) {
      return null;
    }
    const currentPlayer =
      currentGame.leftPlayer.socketID === client.id
        ? currentGame.leftPlayer
        : currentGame.rightPlayer;

    if (currentGame.ballPosition.x > 750) {
      currentGame.ballPosition.x = 400;
      currentGame.ballPosition.y = 400;
      currentGame.score[0] += 1;
      currentGame.ballAngle = Math.random() * Math.PI * 2;
    }

    if (currentGame.ballPosition.x <= 50) {
      currentGame.ballPosition.x = 400;
      currentGame.ballPosition.y = 400;
      currentGame.score[1] += 1;
      currentGame.ballAngle = Math.random() * Math.PI * 2;
    }

    if (
      currentGame.ballPosition.x <= 55 &&
      currentGame.ballPosition.y / 2 - currentGame.leftPlayer.paddlePosition >=
        0 &&
      currentGame.ballPosition.y / 2 - currentGame.leftPlayer.paddlePosition <=
        75
    ) {
      console.log(currentGame.ballPosition);
      currentGame.ballDirection.x *= -1;
    }

    if (
      currentGame.ballPosition.x >= 745 &&
      currentGame.ballPosition.y / 2 - currentGame.rightPlayer.paddlePosition >=
        0 &&
      currentGame.ballPosition.y / 2 - currentGame.rightPlayer.paddlePosition <=
        75
    ) {
      console.log(currentGame.ballPosition);
      currentGame.ballDirection.x *= -1;
    }

    if (currentGame.ballPosition.y < 3 || currentGame.ballPosition.y >= 797) {
      currentGame.ballDirection.y *= -1;
    }

    currentGame.ballPosition.x +=
      Math.cos(currentGame.ballAngle) * currentGame.ballDirection.x;
    currentGame.ballPosition.y +=
      Math.sin(currentGame.ballAngle) * currentGame.ballDirection.y;

    if (currentGame.score[0] === 11 || currentGame.score[1] === 11) {
      console.log('end');
      currentGame.status = 'ended';
    }

    return currentGame;
  }
}
