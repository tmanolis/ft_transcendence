import { Module } from '@nestjs/common';
import { GameService } from '../game/game.service';
import { RetroGameService } from '../game/retro.game.service';
import { GameModule } from '../game/game.module';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { GameGateway, ChatGateway } from './';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [GameModule, ChatModule, JwtModule, UserModule],
  providers: [
    GameGateway,
    ChatGateway,
    GameService,
    RetroGameService,
    JwtService,
    PrismaService,
    UserService,
  ],
})
export class SocketModule {}
