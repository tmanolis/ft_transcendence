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
    public gameID: string,
    public email: string,
    public socketID: string,
    public userName: string,
    public paddlePosition: number,
  ) {}
}

export class Game {
  constructor(
    public gameID: string,
    public nbPlayers: number,
    public leftPlayer: Player,
    public rightPlayer: Player,
    public score: Record<number, number>,
    public ballPosition: Position,
    public ballDirection: Position,
    public ballAngle: number,
    public status: GameStatus,
    public pausedBy: string,
    public inviting: string,
    public type: string,
  ) {}
}
