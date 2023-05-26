import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
  WsException,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';

@WebSocketGateway({ cors: true, namespace: 'game' })
export class GameGateway {
  constructor(
    private readonly gameService: GameService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket, payload: any) {
    const jwt = client.handshake.headers.authorization;
    const user = this.jwtService.decode(jwt);
    const userData = await this.prismaService.user.findUnique({
      where: {
        id: user.sub,
      },
    });
    if (!userData) {
      client.disconnect();
      return;
    }
    this.gameService.createGame(client, user.sub);
  }

  leftPlayerPosition = { x: 0, y: 0 };
  rightPlayerPosition = { x: 580, y: 0 };

  @SubscribeMessage('findGame')
  async handleFindGame(@ConnectedSocket() client: any) {
    const token = client.handshake.headers.authorization;
    const gameID = (await this.gameService.findGame(token)) || '';
    this.gameService.joinGame(gameID, client.id);
    this.server.emit('foundGame', gameID);
  }

  @SubscribeMessage('leftPlayerMove')
  handleLeftPlayerMove(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ) {
    this.gameService.leftPlayerMove(this.server, body, client);
  }

  @SubscribeMessage('rightPlayerMove')
  handleRightPlayerMove(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ) {
    this.gameService.rightPlayerMove(this.server, body, client);
  }

  @SubscribeMessage('gameStart')
  handleGameStart(@MessageBody() body: any) {
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
}
