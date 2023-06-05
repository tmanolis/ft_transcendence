import { IsString, IsInt } from 'class-validator';

export class PositionDto {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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
    this.position = new PositionDto(0, 0);
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
    this.ballPosition = new PositionDto(360,360);
    this.canvasOffsetTop = 0;
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

  @IsInt()
  canvasOffsetTop: number;
}
