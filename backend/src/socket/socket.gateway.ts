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
import { Server, Socket } from 'socket.io'

// Will implement latter 
// import { GameService } from './game/game.service';
// import { ChatService } from './chat/chat.service';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:8080',
    ],
  }
})
export class SocketGateway implements OnGatewayConnection{
  @WebSocketServer()
  server: Server;

  /****************************************************************************/
  /* handle connection/disconnection                                          */
  /****************************************************************************/
  async handleConnection(client: Socket) {
    console.log(client.id, ' connected to generic socket. ^_^');
    // Will implement latter
    // await this.gameService.userConnect(client, this.server);
  }

  async handleDisconnect(client: Socket) {
    console.log(client.id, ' disconnected from generic socket. 0.0');
  }
  
  /****************************************************************************/
  /* listen/emit socket event                                                 */
  /****************************************************************************/

  /****************************************************************************/
  /* GAME                                                                     */
  /****************************************************************************/
  @SubscribeMessage('startGame')
  handleStartGame(client: Socket, payload: Object ): Object {
    console.log(payload);
    console.log("Let's go!");
    return {"event": "start game", "socketID": client.id};
  }

  @SubscribeMessage('movePaddle')
  handleMovePaddle(client: Socket, payload: Object ): Object {
    console.log(payload);
    console.log("Paddle movinnnnn!!!");
    return {"event": "player paddle move", "socketID": client.id};

  }

  /****************************************************************************/
  /* CHAT                                                                     */
  /****************************************************************************/
  @SubscribeMessage('message')
  handleMessageReceived(client: Socket, payload: Object ): Object {
    console.log(payload);
    console.log("Message received!!!");
    return {"event": "player message receivedt ", "socketID": client.id};
  }
}
