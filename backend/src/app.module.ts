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

const cacheConfig = {
  isGlobal: true,
  ttl: 1000 * 60 * 20, // ms, sec, min
  useFactory: async () => ({
    store: await redisStore({
      url: 'redis://redis:6789',
    }),
  }),
};

@Module({
  imports: [
    HelloModule,
    PrismaModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register(cacheConfig),
    UserModule,
    AuthModule,
    JwtModule,
    SocketModule,
    GameModule,
  ],
  providers: [AuthService, UserService, GameService, TwoFA],
  controllers: [UserController],
})
export class AppModule {}
