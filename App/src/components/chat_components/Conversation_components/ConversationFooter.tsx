import React, { useState, FormEvent, useEffect } from 'react';
import ConfirmButton from '../../settings_components/styles/ConfirmButton.styled';
import { ConversationFooterWrapper } from './styles/ConversationFooter.styled';
import { Socket } from 'socket.io-client';
import { Room } from '../../../pages/Chat';

interface ConversationFooterProps {
  chatRoom: Room,
  socket_chat: Socket
}

const ConversationFooter: React.FC<ConversationFooterProps> = ({ chatRoom, socket_chat }) => {
  const [inputValue, setInputValue] = useState("");
  const [errorResponse, setErrorResponse] = useState("");

	useEffect(() => {
	const handleSendMessageSuccess = () => {
    console.log("J'AI ENVOYE MON MESSAGE");
	};

	const handleSendMessageError = (error: any) => {
		console.log("error when joining channel");
		setErrorResponse(error.message); // Assuming error.message contains the error message
	};

	socket_chat.on("sendMessageSuccess", handleSendMessageSuccess);
	socket_chat.on("sendMessageError", handleSendMessageError);

	// Clean up event listeners when the component is unmounted
	return () => {
		socket_chat.off("sendMessageSuccess", handleSendMessageSuccess);
		socket_chat.off("sendMessageError", handleSendMessageError);
	};
	}, [socket_chat]); // not sure

  useEffect (() => {
    setInputValue("");
    setErrorResponse("");
  }, []);
  
  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the form from submitting the traditional way

    const updateDTO = {
      room: chatRoom.name,
			text: inputValue,
		};

		socket_chat.emit("sendMessage", updateDTO);
    setInputValue("");
  };

  return (
    <ConversationFooterWrapper>
      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="type your message"
        />
        <ConfirmButton type="submit">Send</ConfirmButton>
      </form>
      {errorResponse && (
			<div style={{ color: "red", fontSize: "12px", padding: "5px" }}>{errorResponse}</div>)}
    </ConversationFooterWrapper>
  );
};

export default ConversationFooter;
