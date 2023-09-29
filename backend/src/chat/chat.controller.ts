import { Controller, Patch, Body, UseGuards, Res, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminDTO } from '../dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/decorator';
import { User } from '@prisma/client';
import { Response } from 'express';

@UseGuards(JwtGuard)
@ApiTags('Channel')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Patch('mute')
  @ApiOkResponse({ description: 'User has been muted for the coming hour' })
  @ApiUnauthorizedResponse({ description: 'Channel modification not possible' })
  async handleMute(
    @GetUser() user: User,
    @Body() dto: AdminDTO,
    @Res() res: Response,
  ) {
    await this.chatService.mute(user, dto);
    return res.status(200).send({ message: 'User muted for one hour' });
  }

  @Patch('ban')
  @ApiOkResponse({ description: 'User banned from channel' })
  @ApiUnauthorizedResponse({ description: 'Channel modification not possible' })
  async handleBan(
    @GetUser() user: User,
    @Body() dto: AdminDTO,
    @Res() res: Response,
  ) {
    await this.chatService.ban(user, dto);
    return res.status(200).send({ message: 'User banned from channel' });
  }

  @Patch('kick')
  @ApiOkResponse({ description: 'User kicked from channel' })
  @ApiUnauthorizedResponse({ description: 'Channel modification not possible' })
  async handleKick(
    @GetUser() user: User,
    @Body() dto: AdminDTO,
    @Res() res: Response,
  ) {
    await this.chatService.kick(user, dto);
    return res.status(200).send({ message: 'User kicked from channel' });
	}

	
  @Get('rooms')
  @ApiOkResponse({ description: 'Returns rooms that user is connected to' })
  @ApiUnauthorizedResponse({ description: 'Authentification failed' })
  async handleGetRooms(@GetUser() user: User) {
    return await this.chatService.getRooms(user);
  }
}
