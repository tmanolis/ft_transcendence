interface Position {
  x: number;
  y: number;
}

export class Player {
  constructor(
    public socketID: string,
    public gameID: number,
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
    public status: String,
  ) {}
}
