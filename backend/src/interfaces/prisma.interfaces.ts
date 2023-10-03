import { Game, Room, User, UserInRoom } from '@prisma/client';

export interface RoomWithUsers extends Room {
  users: UserInRoom[];
}

export interface UserWithRooms extends User {
  rooms: UserInRoom[];
}

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
