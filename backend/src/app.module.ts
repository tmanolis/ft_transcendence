import {
  Module,
  NestModule,
  MiddlewareConsumer,
  CacheModule,
  CacheStore,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { redisStore } from 'cache-manager-redis-yet';
import { JwtModule } from '@nestjs/jwt';

import { HelloModule } from './hello/hello.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GameGateway } from './game/game.gateway';
import { GameService } from './game/game.service';
import { AuthService } from './auth/auth.service';
import { UserController } from './user/user.controller';
import { JwtFromCookieMiddleware } from './auth/middleware';

const cacheConfig = {
  isGlobal: true,
  ttl: 1000 * 60 * 20, // ms, sec, min
  useFactory: async () => ({
    store: await redisStore({
      url: 'redis://redis:6789',
    }),
  }),
}

@Module({
  imports: [
    PrismaModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register(cacheConfig),
    HelloModule,
    ChatModule,
    UserModule,
    AuthModule,
    JwtModule,
  ],
  providers: [GameGateway, AuthService, GameService],
  controllers: [UserController],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtFromCookieMiddleware).forRoutes('*');
  }
}
