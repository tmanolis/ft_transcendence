import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { NotificationsService } from 'src/notifications/notifications.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8080'],
  },
  namespace: 'notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly notificationsService: NotificationsService) {}

  /****************************************************************************/
  /* handle connection/disconnection                                          */
  /****************************************************************************/
  handleConnection(client: Socket) {
    // connect logic chat
  }

  handleDisconnect(client: Socket) {
    // disconnect logic chat
  }
}
