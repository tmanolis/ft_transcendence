import {
  Body,
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FourtyTwoAuthGuard } from './guard/FourtyTwo.guard';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('fourtytwo/login')
  @UseGuards(FourtyTwoAuthGuard)
  @ApiOkResponse({ description: 'Try logging in using 42 oauth' })
  @ApiUnauthorizedResponse({ description: 'Login failed.' })
  handle42Oauth(): void {
    return;
  }

  @Get('fourtytwo/callback')
  @UseGuards(FourtyTwoAuthGuard)
  @ApiOkResponse({ description: '42 oauth callback url' })
  @ApiUnauthorizedResponse({ description: 'Login failed.' })
  async handle42Login(@Res() res: any, @Req() req: any): Promise<void> {
    this.authService.fourtyTwoLogin(res, req.user);
  }

  @Post('local/signup')
  signup(@Res() res: any, @Body() dto: AuthDto) {
    return this.authService.localSignup(res, dto);
  }

  @Post('local/login')
  signin(@Body() dto: LoginDto) {
    return this.authService.localLogin(dto);
  }
}
