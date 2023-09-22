import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { PrismaService } from "nestjs-prisma";
import { ChatController } from "./chat.controller";
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
	imports: [JwtModule],
	providers: [ChatService, PrismaService, JwtService],
	controllers: [ChatController],
	exports: [ChatService],
})
export class ChatModule {}