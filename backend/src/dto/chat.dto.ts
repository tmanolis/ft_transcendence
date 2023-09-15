export class messageDTO {
	sendtime: Date;
	sender: string;
	text: string;
}

export class roomDTO {
	name: string;
	otherUser: string;
}

export class ChatUser {
	constructor(
		public email: string,
		public socketID: string,
		public userName: string,
		public rooms: ChatRoom[],
	) {}
}

export class ChatRoom {
	constructor(
		public roomID: string,
		public status: Status,
		public members: ChatUser[],
		public creator: string,
		public administrators: string[],
		public muted: string[],
	) {}
}

enum Status {
	"public",
	"private",
	"protected",
}