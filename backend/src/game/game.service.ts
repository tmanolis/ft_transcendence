import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageBody } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { Cache } from 'cache-manager';
import { PrismaService } from 'nestjs-prisma';
import { UserInGameDto, GameDataDto } from './dto';

@Injectable()
export class GameService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /******************************************************************************/
  /* handle the connection                                                      */
  /******************************************************************************/
  async userConnect(client: Socket) {
    // try to get the user name (check if it's loged in)
    const userName = await this.getUserName(client);
    if (userName === '') {
      client.disconnect();
      return;
    }
    // check if user is in a game
    const gameID = await this.findUserInGame(userName);
    console.log('game ID: ', gameID);
    if (gameID !== '') {
      this.joinGame(client.id, gameID, userName);
    }
    await this.createGame(client, userName);
  }

  async getUserName(client: Socket): Promise<string> {
    const jwt = client.handshake.headers.authorization;
    const user = this.jwtService.decode(jwt);
    let userData = null;
    if (user) {
      userData = await this.prismaService.user.findUnique({
        where: { id: user.sub },
      });
    }
    return userData ? userData.userName : '';
  }

  async findUserInGame(userName: string): Promise<string> {
    let gameID = '';
    let userInGame = '';
    if (userName !== '') {
      userInGame = await this.cacheManager.get(userName);
      console.log(userInGame);
      if (userInGame) {
        const userInGameJSON = JSON.parse(userInGame);
        gameID = userInGameJSON.gameID;
      }
    }
    return gameID;
  }

  async createGame(client: Socket, userName: string) {
    const gameData = new GameDataDto();
    const userInGame = new UserInGameDto();

    // set game data
    gameData.gameSocketID = client.id;
    gameData.leftUser.userName = userName;
    gameData.leftUser.socketID = client.id;

    userInGame.gameID = client.id;
    userInGame.side = 'left';
    await this.cacheManager.set(userName, JSON.stringify(userInGame));
    await this.cacheManager.set(client.id, JSON.stringify(gameData));
    console.log(JSON.parse(await this.cacheManager.get(userName)));
    console.log(JSON.parse(await this.cacheManager.get(client.id)));
  }

  // join or re-join a game
  async joinGame(socketID: string, gameID: string, userName: string) {
    const gameData: string = await this.cacheManager.get(gameID);
    const gameDataJSON = JSON.parse(gameData);
    if (userName === gameDataJSON.leftUser.userName) {
      // for the left player rejoin
      gameDataJSON.leftUser.socketID = socketID;
      gameDataJSON.gameSocketID = socketID;
      await this.cacheManager.del(gameID);
      await this.cacheManager.set(socketID, JSON.stringify(gameDataJSON));
      const rightUserName = gameDataJSON.rightUser.userName;
      if (rightUserName !== '') {
        const rightUserInGame: string = await this.cacheManager.get(
          rightUserName,
        );
        if (rightUserInGame) {
          const rightUserInGameJSON = JSON.parse(rightUserInGame);
          rightUserInGameJSON.gameID = socketID;
          await this.cacheManager.set(
            rightUserInGame,
            JSON.stringify(rightUserInGameJSON),
          );
          console.log(await this.cacheManager.get(rightUserInGame));
        }
      }
    } else {
      // for the right player joining
      const userInGame = new UserInGameDto();
      gameDataJSON.rightUser.userName = userName;
      gameDataJSON.rightUser.socketID = socketID;
      userInGame.gameID = gameID;
      userInGame.side = 'right';
      await this.cacheManager.del(gameID);
      await this.cacheManager.set(socketID, JSON.stringify(gameDataJSON));
      await this.cacheManager.set(userName, JSON.stringify(userInGame));
    }
  }

  async findGame(token: string): Promise<string> {
    let gameID = '';
    return gameID;
  }

  async playerMove(
    server: Server,
    @MessageBody() body: any,
    client: Socket,
    side: string,
  ) {}

  async gameLoop() {}
}
