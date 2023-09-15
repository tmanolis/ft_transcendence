import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Socket } from 'socket.io';
import { Cache } from 'cache-manager';
import { PrismaService } from 'nestjs-prisma';
import { Game, GameStatus, Player } from '../dto/game.dto';
import { User, Game as prismaGame } from '@prisma/client';

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

  async createWaitingGame(player: Player){
    const gameID = player.socketID;
    const newGame = new Game(
      gameID,
      1,
      player,
      null,
      [8, 8],
      { x: 400, y: 400, },
      { x: 5, y: 5, },
      Math.random() * Math.PI * 2,
      GameStatus.Waiting,
    );
    player.gameID = gameID;
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

  async joinGameAndLaunch(player: Player, gameID: string) : Promise<boolean> {
    const game = this.games.find((game) => game.gameID === gameID);
    console.log('join and launch', game);
    if (game){
      player.gameID = gameID;
      this.cacheManager.set(`game${player.email}`, JSON.stringify(player));
      game.rightPlayer = player;
      await this.prisma.user.updateMany({
        where: {
          email: {
            in: [game.leftPlayer.email, game.rightPlayer.email],
          },}, data : {
          status: 'PLAYING',
        },
      })
      game.status = GameStatus.Playing;
      return true;
    } else {
      return false;
    }
  }

  /****************************************************************************/
  /* GAME END                                                                 */
  /****************************************************************************/

  endGame(game: Game){
    this.saveGameStats(game);
    this.deleteGame(game.gameID);
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

  movePaddle(client: Socket, payload: {key: string, gameID: string}) {
    console.log(payload);
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
      if (payload.key === 'up') {
        if (currentPlayer.paddlePosition - 5 > 0) {
          currentPlayer.paddlePosition = currentPlayer.paddlePosition - 5;
        }
      } else if (payload.key === 'down') {
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

    // ball hits paddle
    if (
      currentGame.ballPosition.x <= 54 &&
      currentGame.ballPosition.x > 47 &&
      currentGame.ballPosition.y / 2 - currentGame.leftPlayer.paddlePosition >=
        -5 &&
      currentGame.ballPosition.y / 2 - currentGame.leftPlayer.paddlePosition <=
        this.canvas.paddleHeight + 5
    ) {
      currentGame.ballDirection.x *= -1;
      currentGame.ballPosition.x +=
        Math.cos(currentGame.ballAngle) * currentGame.ballDirection.x;
      currentGame.ballPosition.y +=
        Math.sin(currentGame.ballAngle) * currentGame.ballDirection.y;
      return currentGame;
    }

    if (
      currentGame.ballPosition.x >= 748 &&
      currentGame.ballPosition.x < 755 &&
      currentGame.ballPosition.y / 2 - currentGame.rightPlayer.paddlePosition >=
        -5 &&
      currentGame.ballPosition.y / 2 - currentGame.rightPlayer.paddlePosition <=
        this.canvas.paddleHeight + 5
    ) {
      currentGame.ballDirection.x *= -1;
      currentGame.ballPosition.x +=
        Math.cos(currentGame.ballAngle) * currentGame.ballDirection.x;
      currentGame.ballPosition.y +=
        Math.sin(currentGame.ballAngle) * currentGame.ballDirection.y;
      return currentGame;
    }

    // ball pass the paddles
    if (currentGame.ballPosition.x <= 10) {
      currentGame.ballPosition.x = 400;
      currentGame.ballPosition.y = 400;
      currentGame.score[1] += 1;
      currentGame.ballAngle = this.generateAngle(
        currentGame.ballPosition.x,
        currentGame.ballPosition.y,
      );
    }
    if (currentGame.ballPosition.x >= 790) {
      currentGame.ballPosition.x = 400;
      currentGame.ballPosition.y = 400;
      currentGame.score[0] += 1;
      currentGame.ballAngle = this.generateAngle(
        currentGame.ballPosition.x,
        currentGame.ballPosition.y,
      );
    }

    if (currentGame.ballPosition.y < 7 || currentGame.ballPosition.y >= 793) {
      currentGame.ballDirection.y *= -1;
    }

    currentGame.ballPosition.x +=
      Math.cos(currentGame.ballAngle) * currentGame.ballDirection.x;
    currentGame.ballPosition.y +=
      Math.sin(currentGame.ballAngle) * currentGame.ballDirection.y;

    if (currentGame.score[0] === 11 || currentGame.score[1] === 11) {
      console.log('end');
      currentGame.status = GameStatus.Ended;
    }

    return currentGame;
  }

  /****************************************************************************/
  /* GAME STATS                                                               */
  /****************************************************************************/  

  async saveGameStats(game: Game){
    const leftPlayer = await this.prisma.user.findUnique({
      where: {
        email: game.leftPlayer.email
      }, include: {
        games: {},
      }
    })
    const rightPlayer = await this.prisma.user.findUnique({
      where: {
        email: game.leftPlayer.email
      }, include: {
        games: {},
      }
    })


    const winner = game.score[0] > game.score[1] ? leftPlayer : rightPlayer;
    const loser = game.score[1] > game.score[0] ? leftPlayer : rightPlayer;

    const dbGame = await this.prisma.game.create({
      data: {
          players: {
              connect: [
                  { email: leftPlayer.email },
                  { email: rightPlayer.email }
              ]
          },
          winnerId: winner.id,
          loserId: loser.id,
      }
    })

    this.updatePlayerStats(leftPlayer, dbGame);
    this.updatePlayerStats(rightPlayer, dbGame);
  }

  async updatePlayerStats(player: User, game: prismaGame){
    if (player.id === game.winnerId){
      player.gamesWon++;
      if (player.gamesWon === 1){
        if (!player.achievements.includes('WINNER')){
          player.achievements.push('WINNER');
          // emit notification achievement? 
        }
      }
    } else {
      player.gamesLost++;
    }
  }

  /****************************************************************************/
  // helper functions
  /****************************************************************************/
  generateAngle = (x: number, y: number) => {
    let angle = Math.random() * Math.PI * 2;
    console.log('init angle: ', angle);
    if (angle > 3.5 && angle < 5) {
      if (angle > (Math.PI / 2) * 3) {
        angle += 1;
      } else {
        angle -= 1;
      }
    }
    if (angle > 0.6 && angle < 2.5) {
      if (angle > Math.PI / 2) {
        angle += 1;
      } else {
        angle -= 1;
      }
    }
    console.log('mod angle: ', angle);
    if (x > 0 && y > 0) {
      return angle;
    } else if (x > 0 && y < 0) {
      return (angle += Math.PI / 2);
    } else if (x < 0 && y < 0) {
      return (angle += Math.PI);
    } else {
      return (angle += (Math.PI / 2) * 3);
    }
  }

}
