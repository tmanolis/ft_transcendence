import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags, ApiOkResponse } from "@nestjs/swagger";
import { JwtGuard } from "src/auth/guard";
import { ChatService } from "./chat.service";
import { GetUser } from "src/decorator";
import { User } from '@prisma/client'
import { roomDTO } from "src/dto";

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtGuard)
export class ChatController {
	constructor(
		private chatService: ChatService,
	) {}

  @ApiOperation({ description: 'open a DM' })
  @ApiOkResponse({
    description:
      'Returns chat history (or null when this is the first DM).',
  })
	@Post('open')
	openOrCreateDM(@GetUser() user: User, @Body() dto: roomDTO){
		console.log('in chat controller');
		console.log('dto', dto);
		console.log('user', user);
		this.chatService.openOrCreateDM(user, dto);
	}

	@Post('channel/create')
	createChannel(){

	}

}
