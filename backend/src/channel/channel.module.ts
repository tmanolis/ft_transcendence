import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { PrismaService } from 'nestjs-prisma';
import { ChatService } from 'src/chat/chat.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [
    ChannelService,
    PrismaService,
    ChatService,
    JwtService,
    UserService,
  ],
  exports: [ChannelService],
  controllers: [ChannelController],
})
export class ChannelModule {}
