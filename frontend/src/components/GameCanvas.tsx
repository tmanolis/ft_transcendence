import { useRef, useEffect, useState } from "react";
import { socket } from './socket';

const draw = (shape, points, color, context) => {
  if (shape == "quadrilateral") drawQuadrilateral(points, color, context);
  if (shape == "circle") drawCircle(points, color, context);
};

const drawCircle = (points, color, context) => {
  context.beginPath();
  context.arc(points.x, points.y, 10,  0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();
  context.lineWidth = 1.0;
  context.stroke();
}

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

const GameCanvas = ({lPlayerCoord, rPlayerCoord, ballCoord, gameSocket}) => {
  const gameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const width = 720;
  const height = 480;

  useEffect(() => {
    const canvas = gameCanvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.canvas.width = width;
    context.canvas.height = height;

    // draw the field
    const fieldPoints = {
      a: { x: 0, y: 0 },
      b: { x: width, y: 0 },
      c: { x: width, y: height },
      d: { x: 0, y: height },
    };
    draw("quadrilateral", fieldPoints, "rgb(24, 35, 45)", context);
    const offsetTop = context.canvas.offsetTop;
    gameSocket.emit("canvasOffsetTop", offsetTop);

    // draw players
    if (lPlayerCoord.y - offsetTop < 50) lPlayerCoord.y = 50 + offsetTop;
    if (lPlayerCoord.y - offsetTop > 430) lPlayerCoord.y = 430 + offsetTop;
    const lPlayerPoints = {
      a: { x: 20, y: lPlayerCoord.y - context.canvas.offsetTop - 50 },
      b: { x: 30, y: lPlayerCoord.y - context.canvas.offsetTop - 50 },
      c: { x: 30, y: lPlayerCoord.y + 110 - context.canvas.offsetTop - 50 },
      d: { x: 20, y: lPlayerCoord.y + 110 - context.canvas.offsetTop - 50 },
    };
    draw("quadrilateral", lPlayerPoints, "rgb(224, 135, 245)", context);

    if (rPlayerCoord.y - offsetTop < 50) rPlayerCoord.y = 50 + offsetTop;
    if (rPlayerCoord.y - offsetTop > 430) rPlayerCoord.y = 430 + offsetTop;
    const rPlayerPoints = {
      a: { x: rPlayerCoord.x ,     y: rPlayerCoord.y - 50 - context.canvas.offsetTop  },
      b: { x: rPlayerCoord.x + 10, y: rPlayerCoord.y - 50 - context.canvas.offsetTop  },
      c: { x: rPlayerCoord.x + 10, y: rPlayerCoord.y + 110 - 50 - context.canvas.offsetTop  },
      d: { x: rPlayerCoord.x ,     y: rPlayerCoord.y + 110 - 50 - context.canvas.offsetTop  },
    };
    draw("quadrilateral", rPlayerPoints, "rgb(224, 135, 245)", context);

    // draw the ball
    draw("circle", ballCoord, "rgb(224, 135, 245)", context);

  }, [lPlayerCoord, rPlayerCoord, ballCoord ]);


  return <canvas ref={gameCanvasRef} />;
};

export default GameCanvas;
