import styled from "styled-components";
import JBRegular from '../assets/fonts/JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Regular.woff2'
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const PageContainer = styled.div`
  @font-face {
		font-family: 'JetBrains Mono';
    src: url(${JBRegular}) format('woff2');
    font-weight: normal;
    font-style: normal;
	}
	
	h1, p {
		color: white;
		font-family: 'JetBrains Mono', monospace;
  }
	
	background: black;
	align-items: center;
	text-align: center;
	justify-content: center;
	flex-direction: column;
	position: fixed;
	width: 100%;
`

const Pong = () => {
	const canvasRef = useRef<HTMLCanvasElement | null> (null);
	const canvasWidth = 800;
	const canvasHeight = 400;

	const paddleHeight = 75;
	const paddleWidth = 10;
	const [leftPaddleY, setLeftPaddleY] = useState<number>(canvasHeight / 2 - paddleHeight / 2);
  	const [rightPaddleY, setRightPaddleY] = useState<number>(canvasHeight / 2 - paddleHeight / 2);
	const [ball, setBall] = useState<number>(0);
	const [isWaiting, setIsWaiting] = useState<boolean>(true);
	const [countdown, setCountdown] = useState<number>(3);
	const [score, setScore] = useState<Record<number, number>>({ 0: 0, 1: 0 });

	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		socketRef.current = io('http://localhost:3000');

		socketRef.current.on('connect', () => {
			console.log('connected: ', socketRef.current?.id);
		})
		
		socketRef.current.on('error', (error: string) => {
			console.log("Websocket connection error: ", error);
		})

		socketRef.current.on('updateLeftPaddle', (newPosition: string) => {
			setLeftPaddleY(parseInt(newPosition));
		});

		socketRef.current.on('updateRightPaddle', (newPosition: string) => {
			setRightPaddleY(parseInt(newPosition));
		});

		socketRef.current.on('updateScore', (newScore: Record<number, number>) => {
			setScore(newScore);
		})

		socketRef.current.on('endWaitingState', () => {
			setIsWaiting(false);
			const interval = setInterval(() => {
				setCountdown((prevCountdown: number) => {
					if (prevCountdown <= 1) {
						clearInterval(interval);
						return 0;
					} else {
						return prevCountdown - 1;
					}
				})
			}, 1000);
		})

		socketRef.current.on('updateBallPosition', (newPositionBall: string) => {
			setBall(parseInt(newPositionBall));
		});

		socketRef.current.emit('setCanvas', {canvasHeight, paddleHeight, leftPaddleY});
			
		return () => {
			socketRef.current?.disconnect();
			socketRef.current?.off('error');
			socketRef.current?.off('updatePaddlePosition');
			socketRef.current?.off('updateBallPosition');
		};
	}, []);
	
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!isWaiting){
				if (event.key === "ArrowUp") {
					socketRef.current?.emit('movePaddle', 'up');
				} else if (event.key === "ArrowDown") {
					socketRef.current?.emit('movePaddle', 'down');
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		}
	}, [isWaiting]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const context = canvas.getContext("2d");
			if (context) {
				canvas.width = canvasWidth;
				canvas.height = canvasHeight;

				// make background canvas black
				context.fillStyle = 'black';
				context.fillRect(0, 0, canvas.width, canvas.height);

				// draw a white border
				context.strokeStyle = 'white';
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
				context.fillStyle = 'white';
				context.fillRect(40, leftPaddleY, paddleWidth, paddleHeight);
				context.fillRect(canvasWidth - paddleWidth - 40, rightPaddleY, paddleWidth, paddleHeight);

				// add score
				context.font = "60px 'JetBrains Mono', monospace";
				context.fillStyle = "white";
				context.textAlign = "center";
				context.textBaseline = "top";
				context.fillText(score[0].toString(), canvas.width * 0.25, 20);
				context.fillText(score[1].toString(), canvas.width * 0.75, 20);
			}

			if (context && isWaiting) {
				context.font = "30px 'JetBrains Mono', monospace";
				context.fillStyle = "white";
				context.textAlign = "center";
				context.textBaseline = "middle";
				context.fillText("Waiting for another player...", canvas.width / 2, canvas.height / 2);
			  } else if (context && countdown > 0) {
				context.font = "90px 'JetBrains Mono', monospace";
				context.fillStyle = "white";
				context.textAlign = "center";
				context.textBaseline = "middle";
				context.fillText(countdown.toString(), canvas.width / 2, canvas.height / 2);
			  }
		}
	
	}, [leftPaddleY, rightPaddleY, ball, isWaiting, countdown, score])

	return (
		<PageContainer>
			<h1>Pong</h1>
			<canvas ref={canvasRef} />
			<p>Use the arrow keys to play the game</p>
		</PageContainer>
	)
}

export default Pong;
