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
  }

  @SubscribeMessage('leftPlayerMove')
  handleLeftPlayerMove(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ) {
    this.gameService.playerMove(this.server, body, client, "left");
  }

  @SubscribeMessage('rightPlayerMove')
  handleRightPlayerMove(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ) {
    this.gameService.playerMove(this.server, body, client, "right");
  }

  @SubscribeMessage('gameStart')
  handleGameStart(@MessageBody() body: any) {
  }

}
