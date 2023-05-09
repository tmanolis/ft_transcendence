import { Module } from '@nestjs/common';
import { HelloModule } from './hello/hello.module';
import { PrismaModule } from 'nestjs-prisma';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ HelloModule, PrismaModule.forRoot(), ChatModule, UserModule ],
})
export class AppModule {}
