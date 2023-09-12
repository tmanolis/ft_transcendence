export enum GameStatus {
	Playing = 'playing',
	Pause = 'pause',
	Ended = 'ended',
	Waiting = 'waiting',
}

interface Position {
  x: number;
  y: number;
}

export class Player {
  constructor(
    public gameID: number,
    public email: string,
    public socketID: string,
    public userName: string,
    public paddlePosition: number,
  ) {}
}

export class Game {
  constructor(
    public gameID: number,
    public nbPlayers: number,
    public leftPlayer: Player,
    public rightPlayer: Player,
    public score: Record<number, number>,
    public ballPosition: Position,
    public ballDirection: Position,
    public ballAngle: number,
    public status: GameStatus,
  ) {}
}
