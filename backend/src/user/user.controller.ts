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
  @Get('me')
  // GetUser custom decorator, because Request is error prone
  // and like this we can return a prisma type user.
  getMe(@GetUser() user: User) {
    return user;
  }

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
}
