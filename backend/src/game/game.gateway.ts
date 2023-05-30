import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  WsResponse,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket, payload: any) {
    console.log('client auth: ', client.handshake.headers.authorization);
    console.log('client headers: ', client.handshake.headers);
    if (!client.handshake.headers.authorization) {
      client.disconnect();
      console.log('cannot connect!!!');
    }
    console.log(client.id);
  }

  leftPlayerPosition = { x: 0, y: 0 };
  rightPlayerPosition = { x: 580, y: 0 };

  @SubscribeMessage('leftPlayerMove')
  handleLeftPlayerMove(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ) {
    if (body > 360) body = 360;
    const newX = 0 + body * (2 / 9);
    this.leftPlayerPosition = { x: newX, y: body };
    this.server.emit('leftPlayerPosition', { x: newX, y: body });
  }

  @SubscribeMessage('rightPlayerMove')
  handleRightPlayerMove(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ) {
    if (body > 360) body = 360;
    const newX = 580 + body * (2 / 9);
    this.rightPlayerPosition = { x: newX, y: body };
    this.server.emit('rightPlayerPosition', { x: newX, y: body });
  }

  @SubscribeMessage('gameStart')
  handleGameStart(@MessageBody() body: any) {
    console.log(body);
    let x = body.x;
    let y = body.y;
    let randX = Math.floor(Math.floor((Math.random() - 0.5) * 100) * 0.1);
    const randY = Math.floor(Math.floor((Math.random() - 0.5) * 100) * 0.1);
    if (randX < 3 && randX >= 0) {
      randX += 3;
    }
    if (randX > -3 && randX <= 0) {
      randX -= 3;
    }
    const direction = { x: randX, y: randY };

    const gameInterval = setInterval(() => {
      x += direction.x;
      y += direction.y;
      console.log(direction.x, direction.y);
      this.server.emit('ballPosition', { x: x, y: y });
      console.log(this.leftPlayerPosition);
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
      console.log('rightppos:', this.rightPlayerPosition);
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
