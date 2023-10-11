import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { GameService } from './game.service';
import { RetroGameService } from './retro.game.service';
import { UserService } from '../user/user.service';
import { PrismaService } from 'nestjs-prisma';

@Module({
  imports: [JwtModule],
  providers: [
    GameService,
    PrismaService,
    JwtService,
    RetroGameService,
    UserService,
  ],
  exports: [GameService, RetroGameService],
})
export class GameModule {}
