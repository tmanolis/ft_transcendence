import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from 'nestjs-prisma';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ChatController } from './chat.controller';

@Module({
  imports: [JwtModule],
  providers: [ChatService, PrismaService, JwtService],
  exports: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
