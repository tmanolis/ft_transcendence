import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { PrismaService } from 'nestjs-prisma';
import { ChatService } from 'src/chat/chat.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ChannelService, PrismaService, ChatService, JwtService],
  exports: [ChannelService],
  controllers: [ChannelController],
})
export class ChannelModule {}
