import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
// Guard is at control level, because all user-related actions
// need validation
@UseGuards(JwtGuard)
export class UserController {
	@Get('me')
	// GetUser custom decorator, because Request is error prone
	// and like this we can return a prisma type user.
	// @Header('Authorization', 'Bearer ${Cookie('signToken')}')
  	getMe(@GetUser() user: User) {
		console.log("user in user controller", user)
		return user;
  	};
}
