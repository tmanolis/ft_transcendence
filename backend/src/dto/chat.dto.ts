export class messageDTO {
	sendtime: Date;
	sender: string;
	text: string;
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
		public members: ChatUser[],
	) {}
}