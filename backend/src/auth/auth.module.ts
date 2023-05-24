import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { FourtyTwoStrategy } from './strategy/FourtyTwoStrategy';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [HttpModule, PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, FourtyTwoStrategy, PrismaService],
})
export class AuthModule {}
