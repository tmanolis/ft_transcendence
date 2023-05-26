import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Cache } from 'cache-manager';

@Injectable()
export class GameService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async createGame(client: Socket, token: string) {
    const socketID = client.id;
    try {
      token = JSON.parse(token.substr(2)).accessToken;
    } catch (err) {
      console.log('errorrrrrrr parsing JSON!');
      return;
    }

    const gameWaiting = (await this.cacheManager.get('gameWaiting')) || '';
    const gameID: string = (await this.cacheManager.get(token)) || '';
    if (gameWaiting !== '' && gameID !== '') {
      const gameData: string = await this.cacheManager.get(gameID);
      console.log('g Data: ', gameData);
      try {
        const gameDataJSON = JSON.parse(gameData);
        if (gameDataJSON.leftPlayer.userID !== token) {
          this.joinGame(socketID, token);
        }
      } catch {
        console.log('errorrrrrrr parsing JSON!');
        return;
      }
    }
    // check if player is already in game
    if (gameID !== '') {
      const gameData: string = await this.cacheManager.get(gameID);
      let newGameData;
      if (typeof gameData === 'string') {
        try {
          newGameData = JSON.parse(gameData);
        } catch {
          console.log("can't parse!!");
          return;
        }
        if (newGameData && newGameData.leftPlayer.userID === token) {
          newGameData.leftPlayer.socket = socketID;
        } else if (newGameData) {
          newGameData.rightPlayer.socket = socketID;
        }
      }
      this.cacheManager.set(socketID, JSON.stringify(newGameData));
    } else {
      const gameData = {
        leftPlayer: { userID: token, socket: socketID, x: 0, y: 0 },
        rightPlayer: { userID: '', socket: '', x: 0, y: 0 },
      };
      this.cacheManager.set(socketID, JSON.stringify(gameData));
      this.cacheManager.set('gameWaiting', socketID);
    }
    await this.cacheManager.set(token, socketID);
  }

  async findGame(token: string): Promise<string> {
    try {
      token = JSON.parse(token.substr(2)).accessToken;
    } catch (err) {
      console.log('errorrrrrrr parsing JSON!');
      return;
    }
    const gameID: string = (await this.cacheManager.get('gameWaiting')) || '';
    const gameData: string = (await this.cacheManager.get(gameID)) || '';
    const userID = JSON.parse(gameData).leftPlayer.userID;
    console.log(
      'in service findeGame: gameID:|',
      gameID,
      '|;userID: |',
      userID,
      '|; token:|',
      token,
      '|',
    );
    if (token === userID) {
      return '';
    }
    return gameID;
  }

  async joinGame(socketID: string, token: string) {
    this.cacheManager.del('gameWaiting');
    console.log('join');
  }

  async leftPlayerMove(
    server: Server,
    @MessageBody() body: any,
    client: Socket,
  ) {
    console.log('left player movin!');
    const gameData: string = (await this.cacheManager.get(client.id)) || '';
    if (gameData !== '') {
      const newGameData = JSON.parse(gameData);
      if (body > 360) body = 360;
      const newX = 0 + body * (2 / 9);
      newGameData.leftPlayer.x = newX;
      newGameData.leftPlayer.y = body;
      await this.cacheManager.set(client.id, JSON.stringify(newGameData));
      server.emit('leftPlayerPosition', { x: newX, y: body });
    }
  }

  async rightPlayerMove(
    server: Server,
    @MessageBody() body: any,
    client: Socket,
  ) {
    console.log('right player movin!');
    const gameData: string = (await this.cacheManager.get(client.id)) || '';
    if (gameData !== '') {
      const newGameData = JSON.parse(gameData);
      if (body > 360) body = 360;
      const newX = 0 + body * (2 / 9);
      newGameData.rightPlayer.x = newX;
      newGameData.rightPlayer.y = body;
      await this.cacheManager.set(client.id, JSON.stringify(newGameData));
      server.emit('rithgPlayerPosition', { x: newX, y: body });
    }
  }
  /*
  async startGame(client: Socket, token: string, server: Server ) {
    let leftPlayerPosition = { x: 0, y: 0 };
    let rightPlayerPosition = { x: 580, y: 0 };
    if (body > 360) body = 360;
    const newX = 0 + body * (2 / 9);
    this.leftPlayerPosition = { x: newX, y: body };
    this.server.emit('leftPlayerPosition', { x: newX, y: body });
    let x = body.x;
    let y = body.y;
    let randX = Math.floor(Math.floor((Math.random() - 0.5) * 100) * 0.1);
    let randY = Math.floor(Math.floor((Math.random() - 0.5) * 100) * 0.1);
    if (randX < 3 && randX >= 0) {
      randX += 3;
    }
    if (randX > -3 && randX <= 0) {
      randX -= 3;
    }
    let direction = { x: randX, y: randY };

    const gameInterval = setInterval(() => {
      x += direction.x;
      y += direction.y;
      this.server.emit('ballPosition', { x: x, y: y });
      if (y >= 345) {
        direction.x;
        direction.y *= -1;
      }
      if (y <= 15) {
        direction.y *= -1;
      }
      if (
        x <= this.leftPlayerPosition.x &&
        y <= this.leftPlayerPosition.y + 50 &&
        y >= this.leftPlayerPosition.y - 50
      ) {
        if (y > this.leftPlayerPosition) direction.y += 5;
        else direction.y -= 5;

        direction.x *= -1;
      }
      if (x >= this.rightPlayerPosition.x) {
        direction.x *= -1;
      }
      if (x > 720 || x < 0) {
        clearInterval(gameInterval);
        this.server.emit('gameStop', null);
      }
    }, 1000 / 30);
  }
  */
}
