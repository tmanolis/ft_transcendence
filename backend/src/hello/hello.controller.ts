import { Controller, Get, UseGuards } from '@nestjs/common';
import { HelloService } from './hello.service';
import { FourtyTwoAuthGuard } from '../auth/auth.guard';

@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get()
  @UseGuards(FourtyTwoAuthGuard)
  getHello(): Promise<string> {
    return this.helloService.getHello();
  }

}
