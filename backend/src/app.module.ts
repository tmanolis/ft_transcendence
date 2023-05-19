import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import { HelloModule } from './hello/hello.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GameGateway } from './game/game.gateway';

@Module({
  imports: [
    HelloModule,
    PrismaModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    ChatModule,
    UserModule,
    AuthModule,
  ],
  providers: [GameGateway],
})
export class AppModule {}
