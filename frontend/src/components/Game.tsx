import { useRef, useEffect, useState } from "react";
import { socket } from './socket';
import GameCanvas from './GameCanvas.tsx';

socket.connect();
socket.on("connect", (info) => {console.log(info)});

const Game = () => {
  const [lPlayerCoord, setLPlayerCoord] = useState({ x: 0, y: 0 });
  const [rPlayerCoord, setRPlayerCoord] = useState({ x: 580, y: 0});
  const [ballCoord, setBallCoord] = useState({x:360, y: 180});

  let player = "leftPlayer";

  socket.emit("findGame", null);
  socket.on("foundGame", (gameID) => {
    if (gameID)
      player = "rightPlayer";
    else
      socket.emit("createGame", null);
  });
  socket.on("playerJoin", (socketID) => {
  });

  useEffect(() => {
    // add event listener
    const handleMouseMove = (event: MouseEvent) => {
      const newY = event.clientY;
      const newX = 580 + (newY * (2 / 9));
      console.log("newY:", newY * (8/36));
      console.log("newX:", newX);
      console.log("x:", newX," y:", newY)
      setRPlayerCoord({ x: newX, y: newY });
    };

    socket.on('', (value) => {
      setLPlayerCoord({x: value.x, y: value.y})
    });

    window.addEventListener("mousemove", handleMouseMove);
  }, [lPlayerCoord, rPlayerCoord, ballCoord ]);

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
