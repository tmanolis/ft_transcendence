import { Module, forwardRef } from '@nestjs/common';
import { GameService } from './game.service';
import { PrismaService } from 'nestjs-prisma';

@Module({
  providers: [GameService, PrismaService],
  exports: [GameService],
})
export class GameModule {}
