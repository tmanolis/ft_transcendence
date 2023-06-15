import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
