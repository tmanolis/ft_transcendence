import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FourtyTwoAuthGuard } from './guard/FourtyTwo.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('fourtytwo/login')
	@UseGuards(FourtyTwoAuthGuard)
	@ApiOkResponse({ description: 'Try logging in using 42 oauth' })
	@ApiUnauthorizedResponse({ description: 'Login failed.' })
	handle42Oauth() {}

	@Get('fourtytwo/callback')
	@UseGuards(FourtyTwoAuthGuard)
	@ApiOkResponse({ description: '42 oauth callback url' })
	@ApiUnauthorizedResponse({ description: 'Login failed.' })
	async handle42Login(@Res() res: any, @Req() req: any): Promise<string> {
		// res.cookie('access_token', req.user).redirect('/hello');
		return this.authService.handle42Login(res, req);
		// return 'OK!';
	}
}
