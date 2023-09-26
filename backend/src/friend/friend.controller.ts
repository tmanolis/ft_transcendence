import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { FriendService } from './friend.service';
import { GetUser } from 'src/decorator';

@ApiTags('Friend')
@Controller('friend')
@UseGuards(JwtGuard)
export class FriendController {
  constructor(private friendService: FriendService) {}

  /*****************************************************************************/
  // GET
  /*****************************************************************************/
  // Get user's friend list
  @Get('friendList')
  async getFriendList(@GetUser() user: User) {
    return { friendList: user.friends };
  }

  // Get the requests received from other users
  @Get('receivedRequests')
  async getReceivedRequests(@GetUser() user: User) {
    return { receivedRequests: user.friendReqestsReceived };
  }

  // Get the requests sent by me
  @Get('sentRequests')
  async getSentRequests(@GetUser() user: User) {
    return { sentRequests: user.frienRequestsSent };
  }
}
