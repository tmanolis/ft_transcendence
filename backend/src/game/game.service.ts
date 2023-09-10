import { Inject, Injectable, forwardRef, CACHE_MANAGER } from '@nestjs/common';
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
  private gameIDcounter: number = 0;

  async joinOrCreateGame(
    player: Player): Promise<[boolean, number]>{
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
    if (!pendingPlayer && player){
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
      const otherPlayer = JSON.parse(pendingPlayer);
      this.cacheManager.del('pendingPlayer');
      player.gameID = otherPlayer.gameID;
      // check if player is the same as pendingPlayer
      if (otherPlayer.userName === player.userName) {
        this.cacheManager.set('pendingPlayer', JSON.stringify(player));
        return [false, player.gameID];
      }
      this.createGame(otherPlayer, player);
      return [true, otherPlayer.gameID];
    }
  }

  createInvitedGame(player1: Player, 
    player2: Player){
      const gameID = this.gameIDcounter;
      this.gameIDcounter++;
      player1.gameID = gameID;
      player2.gameID = gameID;
      this.createGame(player1, player2);
  }

  async createGame(player1: Player, 
    player2: Player) {
      const newGame = new Game(
        player1.gameID,
        2,
        player1,
        player2,
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

  movePaddle(client: Socket, payload: Object) {
    const currentGame = this.games.find(
      (game) => game.leftPlayer.socketID === client.id || game.rightPlayer.socketID === client.id
    );

    const currentPlayer = (currentGame.leftPlayer.socketID === client.id) ? currentGame.leftPlayer : currentGame.rightPlayer;

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

  gameLogic(client: Socket) : Game{
    const currentGame = this.games.find(
      (game) => game.leftPlayer.socketID === client.id || game.rightPlayer.socketID === client.id
    );

    if (!currentGame) {
      return null;
    }
    const currentPlayer = (currentGame.leftPlayer.socketID === client.id) ? currentGame.leftPlayer : currentGame.rightPlayer;


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
