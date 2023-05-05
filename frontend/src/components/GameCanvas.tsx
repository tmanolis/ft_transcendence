import { useRef, useEffect, useState } from "react";
import { socket } from './socket';

socket.connect();
socket.on("connect", () => {console.log("connected!!!")});

const draw = (shape, points, color, context) => {
  if (shape == "quadrilateral") drawQuadrilateral(points, color, context);
  if (shape == "circle") drawCircle(coord, color, context);
};

const drawQuadrilateral = (points, color, context) => {
  context.beginPath();
  context.moveTo(points.a.x, points.a.y);
  context.lineTo(points.b.x, points.b.y);
  context.lineTo(points.c.x, points.c.y);
  context.lineTo(points.d.x, points.d.y);
  context.lineTo(points.a.x, points.a.y);
  context.closePath();
  context.fillStyle = color;
  context.fill();
  context.lineWidth = 1.0;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.stroke();
};

const GameCanvas = () => {
  const gameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playerCoord, setPlayerCoord] = useState({ x: 0, y: 0 });


  useEffect(() => {
    const canvas = gameCanvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.canvas.width = 720;
    context.canvas.height = 360;

    // draw the field
    const fieldPoints = {
      a: { x: 80, y: 5 },
      b: { x: 640, y: 5 },
      c: { x: 720, y: 360 },
      d: { x: 5, y: 360 },
    };
    draw("quadrilateral", fieldPoints, "rgb(24, 35, 45)", context);

    // draw player
    const playerPoints = {
      a: { x: 100 - playerCoord.x, y: playerCoord.y },
      b: { x: 110 - playerCoord.x, y: playerCoord.y },
      c: { x: 90 - playerCoord.x, y: playerCoord.y + 110 },
      d: { x: 80 - playerCoord.x, y: playerCoord.y + 110 },
    };
    draw("quadrilateral", playerPoints, "rgb(224, 135, 245)", context);

    // add event listener
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const newY = event.clientY - rect.top;
      const newX = (newY * 80) / 360;
      socket.emit('message', "hello");
      setPlayerCoord({ x: newX, y: newY });
    };

    canvas.addEventListener("mousemove", handleMouseMove);
  }, [playerCoord]);

  return <canvas ref={gameCanvasRef} />;
};

export default GameCanvas;
