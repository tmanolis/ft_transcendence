import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags, ApiOkResponse } from "@nestjs/swagger";
import { JwtGuard } from "src/auth/guard";
import { ChatService } from "./chat.service";
import { GetUser } from "src/decorator";
import { User } from '@prisma/client'
import { createRoomDTO } from "src/dto";

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtGuard)
export class ChatController {
	constructor(
		private chatService: ChatService,
	) {}

  @ApiOperation({ description: 'Create room' })
  @ApiOkResponse({
    description:
      'Creates room for direct messaging or channel.',
  })
	@Post('createChannel')
	openOrCreateDM(@GetUser() user: User, @Body() dto: createRoomDTO){
		console.log('in chat controller');
		console.log('dto', dto);
		console.log('user', user);
		return this.chatService.createChannel(user, dto);
	}

}
