import { Room, User, UserInRoom, Message } from '@prisma/client';

export interface RoomWithUsers extends Room {
  users: UserInRoom[];
}

export interface UserWithRooms extends User {
  rooms: UserInRoom[];
}

export interface RoomWithMessages extends Room {
	rooms: Message[];
}