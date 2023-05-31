import { IsString, IsInt } from 'class-validator';

export class PositionDto {
  constructor() {
    x: -1;
    y: -1;
  }

  @IsInt()
  x: number;

  @IsInt()
  y: number;
}

export class UserInGameDto {
  constructor() {
    this.userName = '';
    this.socketID = '';
    this.gameID = '';
    this.side = '';
    this.position = new PositionDto();
  }

  @IsString()
  userName: string;

  @IsString()
  socketID: string;

  @IsString()
  gameID: string;

  @IsString()
  side: string;

  position: PositionDto;
}

export class GameDataDto {
  constructor() {
    this.gameSocketID = '';
    this.ended = false;
    this.paused = false;
    this.leftUser = new UserInGameDto();
    this.rightUser = new UserInGameDto();
    this.ballPosition = new PositionDto();
  }

  @IsString()
  gameID: string;

  @IsString()
  gameSocketID: string;

  ended: boolean;
  paused: boolean;

  leftUser: UserInGameDto;
  rightUser: UserInGameDto;

  ballPosition: PositionDto;
}
