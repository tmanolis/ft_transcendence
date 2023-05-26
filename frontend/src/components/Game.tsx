import { useRef, useEffect, useState } from "react";
import { gameSocket } from './socket';
import GameCanvas from './GameCanvas.tsx';

let player = "";

gameSocket.connect();
gameSocket.on("connect", async (info) => {
  gameSocket.emit("findGame", null);
  gameSocket.on("foundGame", async (gameID) => {
    console.log("gameID: ", gameID)
    if (gameID !== '') {
      console.log("no gameID");
      player = "rightPlayer";
    } else {
      console.log("has gameID");
      player = "leftPlayer";
      gameSocket.emit("createGame", null);
    }
  });
  console.log(player);
});

const Game = () => {
  const [lPlayerCoord, setLPlayerCoord] = useState({ x: 0, y: 0 });
  const [rPlayerCoord, setRPlayerCoord] = useState({ x: 580, y: 0});
  const [ballCoord, setBallCoord] = useState({x:360, y: 180});
  const [gameRunning, setGameRunning] = useState(false);

  gameSocket.on("playerJoin", (socketID) => {
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      console.log(player);
      const newY = event.clientY;
      if (Math.abs(rPlayerCoord.y - newY) > 2) {
        gameSocket.emit(`${player}Move`, newY );
      }
    }

    const handleMouseClick = () => {
      if (gameRunning == false) {
        gameSocket.emit('gameStart', ballCoord);
        setGameRunning(true);
      }
    }
    // add event listener
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleMouseClick);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleMouseClick);
    }
  }, [lPlayerCoord, rPlayerCoord, ballCoord ]);

  gameSocket.on('leftPlayerPosition', (value) => {
    setLPlayerCoord({x: value.x, y: value.y})
  });

  gameSocket.on('rightPlayerPosition', (value) => {
    setRPlayerCoord({x: value.x, y: value.y})
  });

  gameSocket.on('ballPosition', (value) => {
    setBallCoord({x: value.x, y: value.y})
  });

  gameSocket.on('gameStop', () => {
    setBallCoord({x:350, y:180});
    setGameRunning(false);
  });

  return (
    <div>
    <GameCanvas
      lPlayerCoord={lPlayerCoord}
      rPlayerCoord={rPlayerCoord}
      ballCoord={ballCoord}
    />
    </div>
  )
};

export default Game;
