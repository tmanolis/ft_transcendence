import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class messageDTO {
	sendtime: Date;

	@IsString()
	@IsNotEmpty()
	sender: string;
	
	@MaxLength(128)
	@IsString()
	text: string;
}

export class createRoomDTO {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	status: Status;

	@IsString()
	@IsNotEmpty()
	owner: string;

	@IsString()
	@IsOptional()
	password?: string;
}

export class ChatUser {
	constructor(
		public email: string,
		public socketID: string,
		public userName: string,
	) {}
}

export class ChatRoom {
	constructor(
		public roomID: string,
		public status: Status,
		public password: string,
		public members: ChatUser[],
		public owner: string,
		public admins: string[],
		public muted: string[],
	) {}
}

enum Status {
	"public",
	"private",
	"direct",
}