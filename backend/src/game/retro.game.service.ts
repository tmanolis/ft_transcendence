import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Socket } from 'socket.io';
import { Cache } from 'cache-manager';
import { PrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { Game, GameStatus, Player } from '../dto/game.dto';
import { User, Game as prismaGame } from '@prisma/client';

@Injectable()
export class RetroGameService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private canvas: {
    canvasHeight: number;
    paddleHeight: number;
  } = {
    canvasHeight: 0,
    paddleHeight: 0,
  };

  private startPaddle: number = 165;

  /****************************************************************************/
  // User query
  /****************************************************************************/
  async getUserByEmail(email: string): Promise<User> {
    let user: User;
    try {
      user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
    } catch (error) {
      throw error;
    }
    return user;
  }

  async getUserByUsername(username: string): Promise<User> {
    let user: User;
    try {
      user = await this.prisma.user.findUnique({
        where: {
          userName: username,
        },
      });
    } catch (error) {
      throw error;
    }
    return user;
  }

  async getSocketUser(client: Socket): Promise<User> {
    // only works after {socketID, userEmail} stored into cache
    const userEmail: string = await this.cacheManager.get(client.id);
    if (!userEmail) return null;
    const user: User = await this.getUserByEmail(userEmail);
    return user;
  }

  /****************************************************************************/
  // Disconnection
  /****************************************************************************/
  async cancelPendingGame(client: Socket) {
    const playerEmail: string = await this.cacheManager.get(client.id);

    const pendingRetroPlayer: string = await this.cacheManager.get(
      'pendingRetroPlayer',
    );
    if (pendingRetroPlayer) {
      try {
        const pendingRetroPlayerObject: Player = JSON.parse(pendingRetroPlayer);
        if (pendingRetroPlayerObject.email === playerEmail) {
          await this.cacheManager.del('pendingRetroPlayer');
          await this.cacheManager.del(`retrogame${playerEmail}`);
          await this.cacheManager.del(pendingRetroPlayerObject.gameID);
        }
      } catch (error) {
        throw error;
      }
    }
  }

  async updateUserDisconnectStatus(client: Socket) {
    // find the user in database
    const user: User = await this.getSocketUser(client);
    if (!user) return;
    if (user.status === 'WAITING' || user.status === 'PLAYING') {
      try {
        await this.prisma.user.update({
          where: {
            email: user.email,
          },
          data: {
            status: 'AWAY',
          },
        });
      } catch (error) {
        throw error;
      }
    }
    await this.cacheManager.del(client.id);
  }

  async clearData(client: Socket) {
    const player = await this.getSocketPlayer(client);
    if (!player) return;

    const game: Game = await this.getGameByID(player.gameID);
    if (game && game.status === GameStatus.Ended) {
      await this.cacheManager.del(`retrogame${game.gameID}`);
    }
    if (player.gameID === '') {
      await this.cacheManager.del(`retrogame${player.email}`);
    } else {
      await this.pauseGame(player);
    }
  }

  async pauseGame(player: Player) {
    const game = await this.getGameByID(player.gameID);
    if (!game) return;
    game.status = GameStatus.Pause;
    game.pausedBy = player.email;
    await this.cacheManager.set(game.gameID, JSON.stringify(game));
  }

  /****************************************************************************/
  // Create, Update Player(before finding a game)
  /****************************************************************************/
  async createPlayer(client: Socket): Promise<Player> {
    const pausingPlayer = await this.updatePausingPlayer(client);
    if (pausingPlayer) return pausingPlayer;

    const user: User = await this.getSocketUser(client);
    if (!user) return;
    const newPlayer = new Player(
      '',
      user.email,
      client.id,
      user.userName,
      this.startPaddle,
    );
    // save the new Player in redis
    await this.cacheManager.set(
      `retrogame${user.email}`,
      JSON.stringify(newPlayer),
    );
    return newPlayer;
  }

  async updatePausingPlayer(client: Socket): Promise<Player> {
    let pausingPlayer: Player;
    const player: Player = await this.getSocketPlayer(client);
    if (player && player.gameID !== '') {
      player.socketID = client.id;
      await this.cacheManager.set(
        `retrogame${player.email}`,
        JSON.stringify(player),
      );
      pausingPlayer = player;
    }
    return pausingPlayer;
  }

  async getPendingPlayer(): Promise<Player> {
    let pendingRetroPlayer: Player;
    return pendingRetroPlayer;
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    let player: Player;
    const playerString: string = await this.cacheManager.get(
      `retrogame${email}`,
    );
    if (playerString) {
      try {
        player = JSON.parse(playerString);
      } catch (error) {
        throw error;
      }
    }
    return player;
  }

  async getSocketPlayer(client: Socket) {
    let player: Player;
    const playerEmail: string = await this.cacheManager.get(client.id);
    const playerString: string = await this.cacheManager.get(
      `retrogame${playerEmail}`,
    );
    if (playerString) player = JSON.parse(playerString);
    return player;
  }

  /****************************************************************************/
  // find, create, join game
  /****************************************************************************/
  async findMatchingGame(player: Player): Promise<[boolean, string]> {
    let pendingRetroPlayerString: string = await this.cacheManager.get(
      'pendingRetroPlayer',
    );
    let pendingRetroPlayer: Player;
    if (pendingRetroPlayerString) {
      pendingRetroPlayer = JSON.parse(pendingRetroPlayerString);
      try {
        const user: User = await this.prisma.user.findUnique({
          where: {
            email: pendingRetroPlayer.email,
          },
        });
        if (user.status !== 'WAITING')
          this.cacheManager.del('pendingRetroPlayer');
        if (pendingRetroPlayer.userName === player.userName) {
          this.cacheManager.set('pendingRetroPlayer', JSON.stringify(player));
          return [false, player.gameID];
        }
      } catch (error) {
        throw error;
      }
    }

    // Matching
    if (player && player.gameID !== '') {
      const pausingGame: Game = await this.getGameByID(player.gameID);
      if (pausingGame && pausingGame.status === GameStatus.Pause) {
        this.joinGame(player, player.gameID);
        return [true, player.gameID];
      }
    } else {
      this.cacheManager.del('pendingRetroPlayer');
      const gameID = pendingRetroPlayer.gameID;
      this.joinGame(player, gameID);
      return [true, pendingRetroPlayer.gameID];
    }
  }

  async findPausedGame(client: Socket): Promise<string> {
    let gameID: string = '';
    const user: User = await this.getSocketUser(client);
    if (!user) {
      return '';
    }
    const pausingPlayer: string = await this.cacheManager.get(
      `retrogame${user.email}`,
    );
    if (pausingPlayer) {
      let pausingPlayerObject: Player = JSON.parse(pausingPlayer);
      if (pausingPlayerObject.gameID !== '') {
        pausingPlayerObject.socketID = client.id;
        await this.cacheManager.set(
          `retrogame${user.email}`,
          JSON.stringify(pausingPlayerObject),
        );
        gameID = pausingPlayerObject.gameID;
      }
    }
    return gameID;
  }

  async createGame(client: Socket): Promise<Game> {
    let newGame: Game;
    let pendingRetroPlayer: string = await this.cacheManager.get(
      'pendingRetroPlayer',
    );
    // continue to joinGame if there is a pendingRetroPlayer
    let pausedGameID: string = await this.findPausedGame(client);
    if (!pendingRetroPlayer && !pausedGameID) {
      let player: Player = await this.getSocketPlayer(client);
      if (player) {
        newGame = await this.createWaitingGame(player);
      }
    }
    return newGame;
  }

  async createWaitingGame(player: Player): Promise<Game> {
    const gameID = `retrogame${player.socketID}`;
    const newGame = new Game(
      gameID,
      1,
      player,
      null,
      [0, 0],
      { x: 400, y: 400 },
      { x: 2, y: 2 },
      this.generateAngle(1, 1),
      GameStatus.Waiting,
      '',
      '',
      'retro',
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
    } catch (error) {
      throw error;
    }
    this.cacheManager.set(gameID, JSON.stringify(newGame));
    this.cacheManager.set(`retrogame${player.email}`, JSON.stringify(player));
    await this.cacheManager.set('pendingRetroPlayer', JSON.stringify(player));
    return newGame;
  }

  async joinGame(player: Player, gameID: string): Promise<boolean> {
    const game = await this.getGameByID(gameID);

    if (game) {
      player.gameID = gameID;
      this.cacheManager.set(`retrogame${player.email}`, JSON.stringify(player));
      if (
        game.rightPlayer === null ||
        game.rightPlayer.email === player.email
      ) {
        game.rightPlayer = player;
      } else {
        game.leftPlayer = player;
      }
      try {
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
      } catch (error) {
        throw new InternalServerErrorException('User state update failed');
      }
      game.status = GameStatus.Playing;
      game.nbPlayers = 2;
      this.cacheManager.set(gameID, JSON.stringify(game));
      return true;
    } else {
      return false;
    }
  }

  async getGameByID(gameID: string): Promise<Game> {
    let game: Game;
    const gameString: string = await this.cacheManager.get(gameID);
    if (gameString && gameString !== '') game = JSON.parse(gameString);
    return game;
  }

  /****************************************************************************/
  /* GAMEPLAY                                                                 */
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

  async movePaddle(client: Socket, payload: { key: string; gameID: string }) {
    const currentGame = await this.getGameByClient(client);
    if (!currentGame) return;

    const currentPlayer =
      currentGame.leftPlayer.socketID === client.id
        ? currentGame.leftPlayer
        : currentGame.rightPlayer;

    if (!currentPlayer) {
      return;
    } else {
      if (!currentPlayer.paddlePosition) {
        currentPlayer.paddlePosition = 165;
      }
      if (payload.key === 'up') {
        if (currentPlayer.paddlePosition - 5 > 0) {
          currentPlayer.paddlePosition = currentPlayer.paddlePosition - 5;
        }
      } else if (payload.key === 'down') {
        if (currentPlayer.paddlePosition + 5 < 255) {
          currentPlayer.paddlePosition = currentPlayer.paddlePosition + 5;
        }
      }

      await this.cacheManager.set(
        currentGame.gameID,
        JSON.stringify(currentGame),
      );
      return { currentGame: currentGame, currentPlayer: currentPlayer };
    }
  }

  //checkBallPaddleCollision
  // moveBall()

  async gameLogic(client: Socket): Promise<Game> {
    const currentGame = await this.getGameByClient(client);

    if (!currentGame) {
      return null;
    }
    const currentPlayer =
      currentGame.leftPlayer.socketID === client.id
        ? currentGame.leftPlayer
        : currentGame.rightPlayer;

    if (currentGame.status === GameStatus.Pause) {
      return currentGame;
    }
    // ball hits paddle
    // left
    if (
      currentGame.ballPosition.x <= 54 &&
      currentGame.ballPosition.x >= 50 &&
      currentGame.ballPosition.y / 2 - currentGame.leftPlayer.paddlePosition >=
        -5 &&
      currentGame.ballPosition.y / 2 - currentGame.leftPlayer.paddlePosition <=
        this.canvas.paddleHeight + 5
    ) {
      currentGame.ballPosition.x = 400;
      currentGame.ballPosition.y = 400;
      currentGame.score[1] += 1;
      currentGame.ballAngle = this.generateAngle(
        currentGame.ballPosition.x,
        currentGame.ballPosition.y,
      );
    }

    // ball hits paddle
    // right
    if (
      currentGame.ballPosition.x >= 748 &&
      currentGame.ballPosition.x <= 752 &&
      currentGame.ballPosition.y / 2 - currentGame.rightPlayer.paddlePosition >=
        -5 &&
      currentGame.ballPosition.y / 2 - currentGame.rightPlayer.paddlePosition <=
        this.canvas.paddleHeight + 5
    ) {
      currentGame.ballPosition.x = 400;
      currentGame.ballPosition.y = 400;
      currentGame.score[0] += 1;
      currentGame.ballAngle = this.generateAngle(
        currentGame.ballPosition.x,
        currentGame.ballPosition.y,
      );
    }

    // ball pass the paddles
    if (currentGame.ballPosition.x <= 10) {
      if (Math.random() < 0.5) {
        currentGame.ballAngle += (Math.random() / 2) % 6;
      } else {
        currentGame.ballAngle -= (Math.random() / 2) % 6;
      }
      currentGame.ballAngle = Math.abs(currentGame.ballAngle);
      if (currentGame.ballAngle < 2) {
        currentGame.ballAngle += 2;
      }
      if (currentGame.ballAngle > 5) {
        currentGame.ballAngle -= 2;
      }
      currentGame.ballDirection.x *= -1;
      currentGame.ballPosition.x +=
        Math.cos(currentGame.ballAngle) * currentGame.ballDirection.x + 5;
      currentGame.ballPosition.y +=
        Math.sin(currentGame.ballAngle) * currentGame.ballDirection.y;
      await this.cacheManager.set(
        currentGame.gameID,
        JSON.stringify(currentGame),
      );
      return currentGame;
    }
    if (currentGame.ballPosition.x >= 790) {
      if (Math.random() < 0.5) {
        currentGame.ballAngle += (Math.random() / 2) % 6;
      } else {
        currentGame.ballAngle -= (Math.random() / 2) % 6;
      }
      currentGame.ballAngle = Math.abs(currentGame.ballAngle);
      if (currentGame.ballAngle < 2) {
        currentGame.ballAngle += 2;
      }
      if (currentGame.ballAngle > 5) {
        currentGame.ballAngle -= 2;
      }
      currentGame.ballDirection.x *= -1;
      currentGame.ballPosition.x +=
        Math.cos(currentGame.ballAngle) * currentGame.ballDirection.x - 5;
      currentGame.ballPosition.y +=
        Math.sin(currentGame.ballAngle) * currentGame.ballDirection.y;
      await this.cacheManager.set(
        currentGame.gameID,
        JSON.stringify(currentGame),
      );
      return currentGame;
    }

    if (currentGame.ballPosition.y < 7 || currentGame.ballPosition.y >= 793) {
      currentGame.ballDirection.y *= -1;
    }

    currentGame.ballPosition.x +=
      Math.cos(currentGame.ballAngle) * currentGame.ballDirection.x;
    currentGame.ballPosition.y +=
      Math.sin(currentGame.ballAngle) * currentGame.ballDirection.y;

    if (currentGame.score[0] === 11 || currentGame.score[1] === 11) {
      currentGame.status = GameStatus.Ended;
    }

    await this.cacheManager.set(
      currentGame.gameID,
      JSON.stringify(currentGame),
    );
    return currentGame;
  }

  /****************************************************************************/
  /* GAME END                                                                 */
  /****************************************************************************/
  async endGame(game: Game) {
    await this.deletePlayers(game);
    await this.saveGameStats(game);
    await this.deleteGame(game.gameID);
  }

  async deleteGame(gameID: string) {
    const game = await this.getGameByID(gameID);
    if (game) {
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
      this.cacheManager.del(gameID);
    }
  }

  async deletePlayers(game: Game) {
    await this.cacheManager.del(`retrogame${game.leftPlayer.email}`);
    await this.cacheManager.del(`retrogame${game.rightPlayer.email}`);
  }

  async getGameByClient(client: Socket): Promise<Game> {
    const userEmail = await this.cacheManager.get(client.id);
    const playerString: string = await this.cacheManager.get(
      `retrogame${userEmail}`,
    );
    if (!playerString) return null;
    const player: Player = JSON.parse(playerString);
    const game: Game = await this.getGameByID(player.gameID);
    return game;
  }

  /****************************************************************************/
  /* GAME STATS                                                               */
  /****************************************************************************/
  async saveGameStats(game: Game) {
    let leftPlayer: User;
    let rightPlayer: User;
    try {
      leftPlayer = await this.prisma.user.findUnique({
        where: {
          email: game.leftPlayer.email,
        },
        include: {
          games: {},
        },
      });
      rightPlayer = await this.prisma.user.findUnique({
        where: {
          email: game.rightPlayer.email,
        },
        include: {
          games: {},
        },
      });
    } catch (error) {
      throw error;
    }
    let winner: User;
    let loser: User;
    if (game.pausedBy && game.pausedBy !== '') {
      winner = game.pausedBy === leftPlayer.email ? rightPlayer : leftPlayer;
      loser = game.pausedBy === leftPlayer.email ? leftPlayer : rightPlayer;
    } else {
      winner = game.score[0] > game.score[1] ? leftPlayer : rightPlayer;
      loser = game.score[1] > game.score[0] ? leftPlayer : rightPlayer;
    }

    const dbGame = await this.prisma.game.create({
      data: {
        players: {
          connect: [{ email: leftPlayer.email }, { email: rightPlayer.email }],
        },
        winnerId: winner.id,
        loserId: loser.id,
      },
    });

    this.updatePlayerStats(leftPlayer, dbGame);
    this.updatePlayerStats(rightPlayer, dbGame);
  }

  async updatePlayerStats(player: User, dbGame: prismaGame) {
    if (
      player.id === dbGame.winnerId &&
      !player.achievements.includes('WINNER')
    ) {
      try {
        await this.prisma.user.update({
          where: {
            email: player.email,
          },
          data: {
            achievements: {
              push: 'WINNER',
            },
          },
        });
      } catch (error) {
        throw error;
      }
    }

    player.id === dbGame.winnerId ? player.gamesWon++ : player.gamesLost++;
    try {
      await this.prisma.user.update({
        where: {
          email: player.email,
        },
        data: {
          gamesLost: player.gamesLost,
          gamesWon: player.gamesWon,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /****************************************************************************/
  // helper functions
  /****************************************************************************/
  generateAngle = (x: number, y: number) => {
    let angle = Math.random() * Math.PI * 2;
    angle = this.modifyAngle(angle);
    if (x > 0 && y > 0) {
      return angle;
    } else if (x > 0 && y < 0) {
      return (angle += Math.PI / 2);
    } else if (x < 0 && y < 0) {
      return (angle += Math.PI);
    } else {
      return (angle += (Math.PI / 2) * 3);
    }
  };

  modifyAngle(angle) {
    if (angle > 3.8 && angle < 5) {
      if (angle > (Math.PI / 2) * 3) {
        angle += 1;
      } else {
        angle -= 0.7;
      }
    }
    if (angle > 0.7 && angle < 2.5) {
      if (angle > Math.PI / 2) {
        angle += 1;
      } else {
        angle -= 0.7;
      }
    }
    return Math.abs(angle);
  }

  async debugPrintCache() {
    const keys = await this.cacheManager.store.keys();
    for (const key of keys) {
      console.log(
        `\x1b[33m ${key}:\n\t\x1b[4m\x1b[34m${await this.cacheManager.get(
          key,
        )}\x1b[0m`,
      );
    }
  }
}
