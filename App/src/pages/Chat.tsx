import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import JBRegular from '../assets/fonts/JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Regular.woff2'
import Button from "../components/styles/Button.styled";
import { io, Socket } from 'socket.io-client';
import Input from "../components/styles/Input.styled";

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
	const [messageText, setMessageText] = useState('');

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');

		socketRef.current?.emit('findAllMessages', {}, (response: { name: string, text: string}[]) => {
			setMessages(response);
    });

		// Listen for 'message' event and add new messages
    socketRef.current.on('message', (message: { name: string, text: string}) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup function: Disconnect socket when the component unmounts
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

	const sendMessage = () => {
    socketRef.current?.emit('createMessage', { text: messageText }, () => {
      setMessageText('');
    });

	// let timeout;
	// const emitTyping = () => {
	// 	socketRef.current?.emit('typing', { isTyping: true});
	// 	timeout = setTimeout(() => {
	// 		socketRef.current?.emit('typing', { isTyping: false });
	// 	}, 2000);
	// }
  };


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
				<Input onChange={(e) => setMessageText(e.target.value)} placeholder="Type your message..."></Input>
			</ChatContainer>
      <Button onClick={sendMessage}>Send</Button>
    </PageContainer>
  );
}

export default Chat;
