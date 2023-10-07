import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Res,
  Query,
  Delete,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { UsernameDTO, UpdateDto } from 'src/dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@ApiTags('User')
@Controller('user')
// Guard is at control level, because all user-related actions
// need validation.
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}

  // get "me" (own user profile)
  @Get('me')
  // GetUser custom decorator, because Request is error prone
  // and like this we can return a prisma type user.
  handleGetMe(@GetUser() user: User) {
    return user;
  }

  // update user data
  @Patch('update')
  @ApiOkResponse({
    description:
      'Returns "OK" when user info has been updated. Returns base64 string of Google Authenticator QR-image when 2FA has been enabled.',
  })
  @ApiBadRequestResponse({ description: 'Update failed. Please try again!' })
  @UseInterceptors(FilesInterceptor('avatar'))
  async handleUpdateUser(
    @GetUser() user: User,
    @Body() updateDto: UpdateDto,
    @UploadedFiles() files: any[],
  ) {
    if (files && files.length > 0) {
      const avatarFile = files[0].buffer.toString('base64');
      updateDto.avatar = avatarFile;
    }
    return await this.userService.updateUser(user, updateDto);
  }

  @Get('all-users')
  @ApiOkResponse({
    description: 'Returns public data of all users',
  })
  async handlegetAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get('allUsernames')
  @ApiOkResponse({
    description: 'Returns username of all users',
  })
  async handleGetAllUsernames() {
    return await this.userService.getAllUsernames();
  }

  // get all active users in order of win rate
  @Get('leaderboard')
  @ApiOkResponse({
    description: 'Returns ranked list of all users',
  })
  async getLeaderboard() {
    return await this.userService.getLeaderboard();
  }

  @Get('userByUsername')
  @ApiOkResponse({
    description: 'Returns public data of one user',
  })
  async handleGetUserByUsername(@Query() dto: UsernameDTO) {
    return await this.userService.getUserByUsername(dto);
  }

  @Get('gameHistory')
  @ApiOkResponse({
    description: 'Returns game history of one user',
  })
  async handleGetGameHistory(@Query() dto: UsernameDTO, @GetUser() user: User) {
    return await this.userService.getGameHistory(dto, user);
  }

  @Get('myRooms')
  @ApiOkResponse({ description: 'Returns rooms that user is connected to' })
  async handleGetRooms(@GetUser() user: User) {
    return this.userService.getRooms(user);
  }

  @Post('block')
  @ApiOkResponse({ description: 'User is blocked' })
  async handleBlock(
    @GetUser() user: User,
    @Body() dto: UsernameDTO,
    @Res() res: Response,
  ) {
    await this.userService.block(user, dto);
    return res.status(200).send({ message: 'User has been blocked' });
  }

  @Delete('unblock')
  @ApiOkResponse({ description: 'User is unblocked' })
  async handleUnblock(
    @GetUser() user: User,
    @Body() dto: UsernameDTO,
    @Res() res: Response,
  ) {
    await this.userService.unblock(user, dto);
    return res.status(200).send({ message: 'User has been unblocked' });
  }

  @Get('blockList')
  @ApiOkResponse({ description: 'Returns usernames of blocked users' })
  async handleGetBlocklist(@GetUser() user: User) {
    return this.userService.getBlocklist(user);
  }
}
