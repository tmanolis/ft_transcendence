import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, TwoFA, FourtyTwoStrategy } from './strategy';

@Module({
  imports: [
    HttpModule, 
    PrismaModule, 
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FourtyTwoStrategy,
    PrismaService,
    JwtStrategy,
    TwoFA,
  ],
})
export class AuthModule {}
