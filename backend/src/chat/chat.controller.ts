import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags, ApiOkResponse } from "@nestjs/swagger";
import { JwtGuard } from "src/auth/guard";
import { ChatService } from "./chat.service";
import { GetUser } from "src/decorator";
import { User } from '@prisma/client'
import { createRoomDTO, joinRoomDTO } from "src/dto";

@UseGuards(JwtGuard)
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
	constructor(
		private chatService: ChatService,
		) {}
		
		@ApiOperation({ description: 'Create room' })
		@ApiOkResponse({
			description:
      'Creates room for direct messaging or channel.',
		})
		@Post('create-channel')
		handleCreateChannel(@GetUser() user: User, @Body() dto: createRoomDTO){
			console.log('dto', dto);
			return this.chatService.createChannel(user, dto);
		}

		@ApiOperation({ description: 'Join room' })
		@ApiOkResponse({
			description:
      'To join a channel (not for DM).',
		})
		@Post('join-channel')
		handleJoinChannel(@GetUser() user: User, @Body() dto: joinRoomDTO){
			return this.chatService.joinChannel(user, dto);
		}

}
