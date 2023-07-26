import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import JBRegular from '../assets/fonts/JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Regular.woff2'
import Button from "../components/styles/Button.styled";
import { io, Socket } from 'socket.io-client';

type PageContainerProps = {
  children?: React.ReactNode;
}

const PageContainer = styled.div<PageContainerProps>`
  @font-face {
    font-family: 'JetBrains Mono';
    src: url(${JBRegular}) format('woff2');
    font-weight: normal;
    font-style: normal;
  }
`

const ChatContainer = styled.div`
	display: flex;
	place-items: center;
	flex-direction: column;
	align-items: center;
	width: 398px;
	border-radius: 8px;
	box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.25);
	border: none;
`;
	
const MessagesContainer = styled.div`
	background-color: yellow;
`;

const Chat = () => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<{name: string, text: string}[]>([]);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');

    // Cleanup function: Disconnect socket when the component unmounts
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    socketRef.current?.emit('findAllMessages', {}, (response: { name: string, text: string}[]) => {
			setMessages(response);
    });
  }, []);


  return (
    <PageContainer>
			<ChatContainer>
				<MessagesContainer>
					{messages.map((message) => (
							<div key={message.name}>
								<p>{message.name}: {message.text}</p>
							</div>
          ))}
				</MessagesContainer>	
			</ChatContainer>
      <Button>Send</Button>
    </PageContainer>
  );
}

export default Chat;



// import React, { useEffect, useRef } from "react";
// import styled from "styled-components";
// import JBRegular from '../assets/fonts/JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Regular.woff2'
// import Button from "../components/styles/Button.styled";
// import { io } from 'socket.io-client';

// type PageContainerProps = {
// 	children?: React.ReactNode;
// }

// const PageContainer = styled.div<PageContainerProps>`
//   @font-face {
// 		font-family: 'JetBrains Mono';
//     src: url(${JBRegular}) format('woff2');
//     font-weight: normal;
//     font-style: normal;
//   }	
// `
// const Chat = () => {
	
// 	const socket = io('http://localhost:3000');

// 	const messages = ref([]);

// 	onBeforeMount(() => {
// 		socket.emit('findAllMessages', {}, (response) => {
// 			messages.value = response;
// 		})
// 	});

// 	return (
// 		<PageContainer>
// 			<Button>Send</Button>
// 		</PageContainer>
// 	)
// }

// export default Chat;