import { Controller, UseGuards, Body, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/decorator';
import { User } from '@prisma/client';
import { channelDTO } from 'src/dto';

@UseGuards(JwtGuard)
@ApiTags('Channel')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('rooms')
  @ApiOkResponse({ description: 'Returns rooms that user is connected to' })
  @ApiUnauthorizedResponse({ description: 'Authentification failed' })
  async handleGetRooms(@GetUser() user: User) {
    return await this.chatService.getRooms(user);
  }

  @Get('channelMembers')
  @ApiOkResponse({
    description: 'Returns usernames of users connected to a room',
  })
  @ApiUnauthorizedResponse({ description: 'Authentification failed' })
  async handleGetChannelMembers(
    @GetUser() user: User,
    @Body() dto: channelDTO,
  ) {
    return await this.chatService.getChannelMembers(dto);
  }
}
