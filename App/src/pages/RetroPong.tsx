import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import Landing from "../pages/Landing";
import PageContainer from "../components/auth_components/styles/AuthContainer.styled";
import { GameSocket } from "../components/GameSocket";

// Connect to the socket from outside of the component
// avoid reconnection when ever the states changed

interface Position {
  x: number;
  y: number;
}

const RetroPong = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasWidth = 800;
  const canvasHeight = 400;

  const paddleHeight = 150;
  const paddleWidth = 20;
  const [leftPaddleY, setLeftPaddleY] = useState<number>(
    canvasHeight / 2 - paddleHeight / 2,
  );
  const [rightPaddleY, setRightPaddleY] = useState<number>(
    canvasHeight / 2 - paddleHeight / 2,
  );
  const [ball, setBall] = useState<Position>({ x: 0, y: 0 });
  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const [score, setScore] = useState<Record<number, number>>({ 0: 0, 1: 0 });
  const [gameID, setGameID] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    GameSocket.on("error", (error: string) => {
      console.log("Game socket error: ", error);
      navigate("/play");
    });

    GameSocket.on("updateLeftPaddle", (newPosition: string) => {
      setLeftPaddleY(parseInt(newPosition));
    });

    GameSocket.on("updateRightPaddle", (newPosition: string) => {
      setRightPaddleY(parseInt(newPosition));
    });

    GameSocket.on("rejoinRetroGame", (gameData: any) => {
      setIsWaiting(false);
      setBall(gameData.ballPosition);
      setGameID(gameData.gameID);
      console.log(gameID);
      setScore({ 0: gameData.score[0], 1: gameData.score[1] });
    });

    if (!isWaiting) {
      GameSocket.emit("startRetroGame");
    }

    GameSocket.on("endWaitingState", () => {
      setIsWaiting(false);
      console.log("waiting ENDED!!!");
    });

    GameSocket.emit("setRetroCanvas", { canvasHeight, paddleHeight, leftPaddleY, rightPaddleY });

    return () => {
      GameSocket?.off("error");
      GameSocket?.off("updatePaddlePosition");
      GameSocket?.off("updateBallPosition");
    };
  }, [isWaiting]);

  useEffect(() => {
    GameSocket.on("updateGame", (gameData: any) => {
      if (gameData.status === "ended") {
        navigate("/play");
      }
      setBall(gameData.ballPosition);
      setGameID(gameData.gameID);
      setScore({ 0: gameData.score[0], 1: gameData.score[1] });
    });
  }, [gameID]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(gameID);
      console.log(event.key);
      if (!isWaiting) {
        if (event.key === "ArrowUp") {
          GameSocket?.emit("moveRetroPaddle", { key: "up", gameID: gameID });
        } else if (event.key === "ArrowDown") {
          GameSocket?.emit("moveRetroPaddle", { key: "down", gameID: gameID });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isWaiting]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // make background canvas black
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // draw a white border
        context.strokeStyle = "pink";
        context.lineWidth = 3;
        context.setLineDash([]);
        context.strokeRect(0, 0, canvas.width, canvas.height);

        // draw the dashed divider line
        context.setLineDash([30, 15]);
        context.beginPath();
        context.moveTo(canvas.width / 2, 0);
        context.lineTo(canvas.width / 2, canvas.height);
        context.stroke();

        // draw both paddles
        context.fillStyle = "pink";
        context.fillRect(40, leftPaddleY, paddleWidth, paddleHeight);
        context.fillRect(
          canvasWidth - paddleWidth - 40,
          rightPaddleY,
          paddleWidth,
          paddleHeight,
        );

        // draw the ball
        if (!isWaiting && Math.random() < 0.3) {
          context.fillStyle = "pink";
          context.fillRect(
            ball.x - paddleWidth / 2,
            ball.y / 2 - paddleWidth / 2,
            paddleWidth,
            paddleWidth,
          );
        }

        // add score
        context.font = "60px 'JetBrains Mono', monospace";
        context.fillStyle = "pink";
        context.textAlign = "center";
        context.textBaseline = "top";
        context.fillText(score[0].toString(), canvas.width * 0.25, 20);
        context.fillText(score[1].toString(), canvas.width * 0.75, 20);
      }

      if (context && isWaiting) {
        context.font = "30px 'JetBrains Mono', monospace";
        context.fillStyle = "pink";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(
          "Waiting for another player...",
          canvas.width / 2,
          canvas.height / 2,
        );
      } 
    }
  }, [leftPaddleY, rightPaddleY, ball, isWaiting, score]);

  return (
    <>
      <Landing />
      <PageContainer>
        <h1>Retro Pong</h1>
        <canvas ref={canvasRef} />
        <p>Use the arrow keys to play the game</p>
      </PageContainer>
    </>
  );
};

export default RetroPong;
