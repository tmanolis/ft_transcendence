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

const GameCanvas = ({lPlayerCoord, rPlayerCoord, ballCoord}) => {
  const gameCanvasRef = useRef<HTMLCanvasElement | null>(null);

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

    // draw players
    const lPlayerAngle = [20, 0];
    const rPlayerAngle = [0, 20];

    const lPlayerPoints = {
      a: { x: 80 + lPlayerAngle[0], y: lPlayerCoord.y },
      b: { x: 90 + lPlayerAngle[0], y: lPlayerCoord.y },
      c: { x: 90 + lPlayerAngle[1], y: lPlayerCoord.y + 110 },
      d: { x: 80 + lPlayerAngle[1], y: lPlayerCoord.y + 110 },
    };
    draw("quadrilateral", lPlayerPoints, "rgb(224, 135, 245)", context);

    const rPlayerPoints = {
      a: { x: rPlayerCoord.x + rPlayerAngle[0], y: rPlayerCoord.y },
      b: { x: rPlayerCoord.x + 10 + rPlayerAngle[0], y: rPlayerCoord.y },
      c: { x: rPlayerCoord.x + 10 + rPlayerAngle[1], y: rPlayerCoord.y + 110 },
      d: { x: rPlayerCoord.x + rPlayerAngle[1], y: rPlayerCoord.y + 110 },
    };
    draw("quadrilateral", rPlayerPoints, "rgb(224, 135, 245)", context);

    // draw the ball
    draw("circle", ballCoord, "rgb(224, 135, 245)", context);

  }, [lPlayerCoord, rPlayerCoord, ballCoord ]);


  return <canvas ref={gameCanvasRef} />;
};

export default GameCanvas;
