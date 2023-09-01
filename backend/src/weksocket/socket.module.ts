import { Module, forwardRef } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [forwardRef(() => GameModule)],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
