import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
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
    return { receivedRequests: user.friendRequestsReceived };
  }

  // Get the requests sent by me
  @Get('sentRequests')
  async getSentRequests(@GetUser() user: User) {
    return { sentRequests: user.friendRequestsSent };
  }

  /*****************************************************************************/
  // POST 
  /*****************************************************************************/
  // Send request
  @Post('sendFriendRequest')
  async sendFriendRequest(
    @GetUser() user: User,
    @Body() payload: { userEmail: string },
    @Res() res: Response,
  ) {
    const result = await this.friendService.sendFriendRequest(
      user,
      payload,
      res,
    );
    res.status(result.statusCode).send({ status: result.status, message: result.message });
  }

  /*****************************************************************************/
  // PATCH
  /*****************************************************************************/
  // Cancel request
  @Patch('cancelFriendRequest')
  async cancelFriendRequest(
    @GetUser() user: User,
    @Body() payload: { userEmail: string },
    @Res() res: Response,
  ) {
    const result = await this.friendService.cancelFriendRequest(
      user,
      payload,
      res,
    );
    res.status(result.statusCode).send({ status: result.status, message: result.message });
  }



}
