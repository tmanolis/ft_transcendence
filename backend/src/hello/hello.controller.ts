import { Controller, Get, Query } from '@nestjs/common';
import { HelloService } from './hello.service';

@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get()
  getHello(): Promise<string> {
    return this.helloService.getHello();
  }

  @Get('/error')
  getError(@Query('error') error: string): Promise<string> {
    return this.helloService.getError(error);
  }
}
