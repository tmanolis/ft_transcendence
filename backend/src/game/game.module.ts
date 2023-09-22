import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { GameService } from './game.service';
import { PrismaService } from 'nestjs-prisma';

@Module({
  imports: [JwtModule],
  providers: [GameService, PrismaService, JwtService],
  exports: [GameService],
})
export class GameModule {}
