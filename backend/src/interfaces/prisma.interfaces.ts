import { Room, User, UserInRoom } from '@prisma/client';

export interface RoomWithUsers extends Room {
  users: UserInRoom[];
}

export interface UserWithRooms extends User {
  rooms: UserInRoom[];
}
