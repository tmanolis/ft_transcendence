import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { HelloModule } from './hello/hello.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TwoFA } from './auth/strategy';
import { SocketModule } from './socket/socket.module';
import { GameModule } from './game/game.module';
import { GameService } from './game/game.service';

@Module({
  imports: [
    HelloModule,
    PrismaModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    JwtModule,
		SocketModule,
		GameModule,
  ],
  providers: [
		AuthService, 
		UserService, 
		TwoFA],
  controllers: [UserController],
})
export class AppModule {}
