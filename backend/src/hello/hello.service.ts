import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class HelloService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello(): Promise<string> {
    return 'Everything is going alright!';
  }

  async getError(error: string): Promise<string> {
    return 'An error has occurred.... ' + error;
  }
}
