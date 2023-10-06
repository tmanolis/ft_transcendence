import { Room, User, UserInRoom, Message, BlockedUser } from '@prisma/client';

export interface RoomWithUsers extends Room {
  users: UserInRoom[];
}

export interface UserWithRooms extends User {
  rooms: UserInRoom[];
}

export interface RoomWithMessages extends Room {
  rooms: Message[];
}

export interface UserInRoomWithUser extends UserInRoom {
  user: User;
}

export interface UserWithBlocklist extends User {
	blockedUsers: BlockedUser[];
}

// export interface BlockedUserWithUsername extends BlockedUser {
// 	blockedUser: User & { userName: string };
// }

// export interface UserWithNamedBlocklist extends BlockedUserWithUser {
// 	blockedUsers: BlockedUserWithUser[];
// }

export interface UserWithGames {
  userName: string;
  avatar: string;
  status: string;
  gamesWon: number;
  gamesLost: number;
  achievements: string[];
  games: {
    gameId: number;
    players: {
      userName: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
    winnerId: string;
  }[];
}

export interface RoomHistory {
  room: string;
  messages: Message[];
}
