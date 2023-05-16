import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FourtyTwoAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {

  @Get('fourtytwo/login')
  @UseGuards(FourtyTwoAuthGuard)
  @ApiOkResponse({ description: 'Try logging in using 42 oauth' })
	@ApiUnauthorizedResponse({ description: 'Login failed.' })
  handleLogin(){}

}
