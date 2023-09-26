import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { UpdateDto } from 'src/dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

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
  getMe(@GetUser() user: User) {
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
  async edit(
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

  // get all active user on the server
  @Get('all-users')
  @ApiOkResponse({
    description: 'Returns all users public data',
  })
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  // get all active users in order of win rate
  @Get('leaderboard')
  @ApiOkResponse({
    description: 'Returns ranked users',
  })
  async getLeaderboard() {
    return await this.userService.getLeaderboard();
  }

  // THIS FUNCTION IS JUST FOR TESTING!!!
  // You can add games to a player
  // Please remove before merge
  // payload: {won: number, lost: number}
  @Post('addGame')
  addGame(@Body() payload, @GetUser() user: User) {
    this.userService.addGames(payload, user);
  }
}
