import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { GameService } from '../game/game.service';
import { GameModule } from '../game/game.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [GameModule, JwtModule],
  providers: [SocketGateway, GameService, JwtService],
})
export class SocketModule {}
