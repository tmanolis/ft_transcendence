import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Cache } from 'cache-manager';

@Injectable()
export class GameService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async createGame(client: Socket, token: string) {
    // check if player is already in game
  }

  async joinGame(socketID: string, token: string) {
  }

  async findGame(token: string): Promise<string> {
  }

  async isPlayerInGame(playerID:stirng) {
  }

  async playerMove(
    server: Server,
    @MessageBody() body: any,
    client: Socket,
    side: string,
  ){
  }

  async gameLoop(){
  }
}
