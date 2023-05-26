import { Controller, Get, UseGuards } from '@nestjs/common';
import { HelloService } from './hello.service';
import { JwtGuard } from '../auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get()
  getHello(): Promise<string> {
    return this.helloService.getHello();
  }
}
