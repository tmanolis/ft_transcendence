import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { PrismaService } from "nestjs-prisma";

@Module({
	providers: [ChatService, PrismaService],
	exports: [ChatService],
})
export class ChatModule {}