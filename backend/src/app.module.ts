import { Module } from '@nestjs/common';
import { HelloModule } from './hello/hello.module';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [HelloModule, PrismaModule.forRoot()],
})
export class AppModule {}
