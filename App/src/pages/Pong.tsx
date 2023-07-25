import styled from "styled-components";
import JBRegular from '../assets/fonts/JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Regular.woff2'
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
// import { Socket } from "socket.io-client/debug";



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
	const [leftPaddleY, setLeftPaddleY] = useState(canvasHeight / 2 - paddleHeight / 2);
  const [rightPaddleY, setRightPaddleY] = useState(canvasHeight / 2 - paddleHeight / 2);

  // const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

	// useEffect(() => {
	// 	const newSocket = io('http://localhost:3000');

	// 	if (socket) {
	// 		socket.disconnect();
	// 	}

	// 	setSocket(newSocket);

	// 	return () => {
	// 		newSocket.disconnect();
	// 	};
	// }, [socket]);

	const socket = io('http://localhost:3000');

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "w") {
			socket.emit('movePaddle', { direction: 'up', leftPaddleY, canvasHeight, paddleHeight });
		} else if (event.key === "s") {
			socket.emit('movePaddle', { direction: 'down', leftPaddleY, canvasHeight, paddleHeight });
		}
		if (event.key === "ArrowUp") {
			setRightPaddleY((prevY) => Math.max(prevY - 10, 0));
		} else if (event.key === "ArrowDown") {
			setRightPaddleY((prevY) => Math.min(prevY + 10, canvasHeight - paddleHeight));
		}
	}

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);

		socket.on("updatePaddlePosition", ({ leftPaddleY }) => {
			setLeftPaddleY(leftPaddleY);
		});

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [ leftPaddleY ]);

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
			}
		}
	
	}, [leftPaddleY, rightPaddleY])


	return (
		<>
		<PageContainer>
			<h1>Pong</h1>
			<canvas ref={canvasRef} />
			<p>Use the arrow keys to play the game</p>
		</PageContainer>
		</>
	)
}

export default Pong;
