import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [PrismaModule,
            MulterModule.register({
              dest: './uploads',
            }),],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
