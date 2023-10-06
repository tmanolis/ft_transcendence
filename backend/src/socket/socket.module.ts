import { Module } from '@nestjs/common';
import { GameService } from '../game/game.service';
import { RetroGameService } from '../game/retro.game.service';
import { GameModule } from '../game/game.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { GameGateway, ChatGateway, NotificationsGateway } from './';
import { ChatModule } from 'src/chat/chat.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
// import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [GameModule, ChatModule, NotificationsModule, JwtModule],
  providers: [
    GameGateway,
    ChatGateway,
    NotificationsGateway,
    GameService,
    RetroGameService,
    JwtService,
    PrismaService,
  ],
})
export class SocketModule {}
