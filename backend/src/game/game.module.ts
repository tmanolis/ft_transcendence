import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { GameService } from './game.service';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { PrismaService } from 'nestjs-prisma';

@Module({
  imports: [JwtModule],
  providers: [GameService, PrismaService, JwtService, UserService],
  exports: [GameService],
})
export class GameModule {}
