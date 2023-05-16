import { Module } from '@nestjs/common';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule],
  controllers: [HelloController],
  providers: [HelloService, PrismaService]
})
export class HelloModule {}
