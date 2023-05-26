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
import { JwtFromCookieMiddleware } from './auth/middleware';

@Module({
  imports: [
    HelloModule,
    PrismaModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    ChatModule,
    UserModule,
    AuthModule,
	JwtModule,
  ],
  providers: [GameGateway, AuthService],
  controllers: [UserController],
})
export class AppModule implements NestModule {
	configure (consumer: MiddlewareConsumer) {
		consumer.apply(JwtFromCookieMiddleware).forRoutes('*');
	}
}
