// this should all be stored in the cache:
interface Position {
  x: number;
  y: number;
}

class Player {
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
    public status: string,
  ) {}
}
