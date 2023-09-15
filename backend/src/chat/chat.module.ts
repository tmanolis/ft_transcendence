import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { PrismaService } from "nestjs-prisma";
import { ChatController } from "./chat.controller";

@Module({
	providers: [ChatService, PrismaService],
	controllers: [ChatController],
	exports: [ChatService],
})
export class ChatModule {}