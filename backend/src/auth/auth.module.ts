import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { FourtyTwoStrategy } from './strategy/FourtyTwoStrategy';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, FourtyTwoStrategy, PrismaService],
})
export class AuthModule {}
