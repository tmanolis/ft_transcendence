import { IsString } from 'class-validator';

export class UserInGameDto {
  constructor() {
    this.gameID = '';
    this.side = '';
  }

  @IsString()
  gameID: string;

  @IsString()
  side: string;
}

export class GameDataDto {
  constructor() {
    this.gameSocketID = '';
    this.ended = false;
    this.paused = false;
    this.leftUser = {
      userName: '',
      socketID: '',
      position: {
        x: 0,
        y: 0,
      },
    };
    this.rightUser = {
      userName: 'test',
      socketID: '',
      position: {
        x: 0,
        y: 0,
      },
    };
  }

  gameSocketID: string;
  ended: boolean;
  paused: boolean;
  leftUser: {
    userName: string;
    socketID: string;
    position: {
      x: number;
      y: number;
    };
  };
  rightUser: {
    userName: string;
    socketID: string;
    position: {
      x: number;
      y: number;
    };
  };
}
