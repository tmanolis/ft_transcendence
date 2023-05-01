import { Module } from '@nestjs/common';
import { HelloModule } from './hello/hello.module';
import { PrismaModule } from 'nestjs-prisma';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ HelloModule, PrismaModule.forRoot(), ChatModule ],
})
export class AppModule {}
