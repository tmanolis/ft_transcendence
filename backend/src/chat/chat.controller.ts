<<<<<<< HEAD
import { Controller, Patch, Body, UseGuards, Res } from '@nestjs/common';
=======
import { Controller, UseGuards, Res, Get } from '@nestjs/common';
>>>>>>> 1c8ddf50251285217c8e7a1ff0543099b41be44f
import { ChatService } from './chat.service';
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
<<<<<<< HEAD
import { toPublicDTO, changePassDTO, adminDTO } from '../dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/decorator';
import { User } from '@prisma/client';
import { Response } from 'express';
=======
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/decorator';
import { User } from '@prisma/client';
>>>>>>> 1c8ddf50251285217c8e7a1ff0543099b41be44f

@UseGuards(JwtGuard)
@ApiTags('Channel')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

<<<<<<< HEAD
  @Patch('toPublic')
  @ApiOkResponse({ description: 'Channel has been set to public' })
  @ApiUnauthorizedResponse({ description: 'Channel modification not possible' })
  async handleToPublic(
    @GetUser() user: User,
    @Body() dto: toPublicDTO,
    @Res() res: Response,
  ) {
    await this.chatService.toPublic(user, dto);
    return res.status(200).send({ message: 'Channel set to public' });
  }

  @Patch('toPrivate')
  @ApiOkResponse({ description: 'Channel has been set to private' })
  @ApiUnauthorizedResponse({ description: 'Channel modification not possible' })
  async handleToPrivate(
    @GetUser() user: User,
    @Body() dto: changePassDTO,
    @Res() res: Response,
  ) {
    await this.chatService.toPrivate(user, dto);
    return res.status(200).send({ message: 'Channel set to private' });
  }

  @Patch('changePass')
  @ApiOkResponse({ description: 'Password has been updated' })
  @ApiUnauthorizedResponse({ description: 'Channel modification not possible' })
  async handleChangePass(
    @GetUser() user: User,
    @Body() dto: changePassDTO,
    @Res() res: Response,
  ) {
    await this.chatService.changePass(user, dto);
    return res.status(200).send({ message: 'Channel password changed' });
  }

  @Patch('addAdmin')
  @ApiOkResponse({ description: 'User is now channel admin' })
  @ApiUnauthorizedResponse({ description: 'Channel modification not possible' })
  async handleAddAdmin(
    @GetUser() user: User,
    @Body() dto: adminDTO,
    @Res() res: Response,
  ) {
    await this.chatService.addAdmin(user, dto);
    return res
      .status(200)
      .send({ message: dto.userName + ' is now channel admin' });
  }

  @Patch('removeAdmin')
  @ApiOkResponse({ description: 'User is no longer channel admin' })
  @ApiUnauthorizedResponse({ description: 'Channel modification not possible' })
  async handleRemoveAdmin(
    @GetUser() user: User,
    @Body() dto: adminDTO,
    @Res() res: Response,
  ) {
    await this.chatService.removeAdmin(user, dto);
    return res
      .status(200)
      .send({ message: dto.userName + ' is removed from channel admins' });
=======
  @Get('rooms')
  @ApiOkResponse({ description: 'Returns rooms that user is connected to' })
  @ApiUnauthorizedResponse({ description: 'Authentification failed' })
  async handleGetRooms(@GetUser() user: User) {
    return await this.chatService.getRooms(user);
>>>>>>> 1c8ddf50251285217c8e7a1ff0543099b41be44f
  }
}
