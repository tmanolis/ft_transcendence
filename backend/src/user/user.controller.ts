import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { GetUserByEmailDTO, GetUserByUsernameDTO, UpdateDto } from 'src/dto';
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

  // get all active user on the server
  @Get('allUsers')
  @ApiOkResponse({
    description: 'Returns all users public data',
  })
  async handlegetAllUsers() {
    return await this.userService.getAllUsers();
  }

	@Get('userByUsername')
  @ApiOkResponse({
    description: 'Returns public data of one user',
  })
	async handleGetUserByUsername(
		@Body() dto: GetUserByUsernameDTO,
	){
		return await this.userService.getUserByUsername(dto);
	}

	@Get('usernameByEmail')
  @ApiOkResponse({
    description: 'Returns public data of one user',
  })
	async handleGetUserByEmail(
		@Body() dto: GetUserByEmailDTO,
	){
		return await this.userService.getUserByEmail(dto);
	}
}
