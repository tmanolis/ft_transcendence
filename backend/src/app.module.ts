import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import { HelloModule } from './hello/hello.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GameGateway } from './game/game.gateway';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TwoFA } from './auth/strategy';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    HelloModule,
    PrismaModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    ChatModule,
    UserModule,
    AuthModule,
    JwtModule,
    MessagesModule,
  ],
  providers: [GameGateway, AuthService, UserService, TwoFA],
  controllers: [UserController],
})
export class AppModule {}
