import { Res, Body, Controller, Get, Patch, Post, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { UpdateDto } from 'src/auth/dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

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
    return UserService.excludePassword(user);
  }

  @Patch('me/update') 
  @ApiOkResponse({ description: 'User info has been updated.' })
  @ApiBadRequestResponse({ description: 'Update failed. Please try again!' })
  @UseInterceptors(FilesInterceptor('avatar'))
  async edit(@GetUser() user: User, @Body() updateDto: UpdateDto, @UploadedFiles() files: any[]) {
    if (files && files.length > 0){
      const avatarFile = files[0].buffer.toString('base64');
      updateDto.avatar = avatarFile;
    }
    await this.userService.updateUser(user, updateDto);
    return UserService.excludePassword(user);
  }
}
