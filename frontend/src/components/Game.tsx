import { useRef, useEffect, useState } from "react";
import { gameSocket } from './socket';
import GameCanvas from './GameCanvas.tsx';

let player = "";
let gameID = "";

gameSocket.connect();
gameSocket.on("connect", async (info) => {
  gameSocket.on("gameData", async (gameData) => {
    gameID = gameData.gameSocketID;
    if (gameData.leftUser.socketID === gameSocket.id) {
      player = "leftPlayer";
    } else {
      player = "rightPlayer";
    }
  });
});

const Game = () => {
  const [lPlayerCoord, setLPlayerCoord] = useState({ x: 0, y: 200 });
  const [rPlayerCoord, setRPlayerCoord] = useState({ x: 700, y: 200 });
  const [ballCoord, setBallCoord] = useState({x:360, y: 240});
  const [gameRunning, setGameRunning] = useState(false);

  gameSocket.on("playerJoin", (socketID) => {
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      console.log(player);
      const newY = event.clientY;
      if (Math.abs(rPlayerCoord.y - newY) > 2) {
        gameSocket.emit(`${player}Move`, {gameID: gameID, y: newY} );
      }
    }

    const handleMouseClick = () => {
      if (gameRunning == false) {
        gameSocket.emit('startGame', {gameID: gameID});
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

  gameSocket.on('playerMove', (gameData) => {
    if (player === "leftPlayer") {
       setLPlayerCoord({
         x: gameData.leftUser.position.x,
         y: gameData.leftUser.position.y,
       })
    } else {
       setRPlayerCoord({
         x: gameData.leftUser.position.x,
         y: gameData.leftUser.position.y,
       })
    }
  });

  gameSocket.on('refreshGame', (value) => {
    setBallCoord({x: value.ballPosition.x, y: value.ballPosition.y})
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
      gameSocket={gameSocket}
    />
    </div>
  )
};

export default Game;
