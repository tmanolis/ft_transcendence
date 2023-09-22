import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { RoomStatus } from '@prisma/client';

export class messageDTO {
	@ApiProperty({ description: 'roomname or emailuser1-emailuser2 for DM (alphabetic order)'})
	@IsString()
	@IsNotEmpty()
	room: string;
	
	@ApiProperty({ description: 'current username of sender'})
	@IsString()
	@IsNotEmpty()
	sender: string;

	@ApiProperty({ description: 'message (max 128 characters)'})
	@MaxLength(128)
	@IsString()
	text: string;
}

export class createRoomDTO {
	@ApiProperty({ description: 'roomname or emailuser1-emailuser2 for DM (alphabetic order)'})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({ description: 'status: private/public/direct' })
	@IsNotEmpty()
	@IsString()
	status: RoomStatus;

	@ApiProperty({ description: 'only for private channels' })
	@IsString()
	@IsOptional()
	password?: string;
}

export class joinRoomDTO {
	@ApiProperty({ description: 'channel name'})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({ description: 'only for private channels' })
	@IsString()
	@IsOptional()
	password?: string;
}


export class ChatUser {
	constructor(
		public email: string,
		public socketID: string,
		public userName: string,
		public rooms: string[],
	) {}
}

export class ChatMessage {
	constructor(
		public room: string,
		public date: number,
		public sender: string,
		public text: string,
	) {}
}

export class ChatRoom {
	constructor(
		public roomID: string,
		public status: string,
		public password: string,
		public members: ChatUser[],
		public owner: string,
		public admins: ChatUser[],
		public muted: ChatUser[],
	) {}
}
