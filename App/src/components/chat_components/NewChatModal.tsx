import React, { useEffect, useState } from "react";
import { ModalContainer, PopUpWrapper } from "./styles/NewChatModal.styled";
import iconSrc from "../../../public/icon/Cross.svg";
import ConfirmButton from "../settings_components/styles/ConfirmButton.styled";
import { Socket } from "socket.io-client";
import AllChannelsList from "./AllChannelsList";

interface NewChatModalProps {
	onCancel: () => void;
	socket_chat: Socket
}
  
export const NewChatModal: React.FC<NewChatModalProps> = ({ onCancel, socket_chat }) => {
  	const [errorResponse, setErrorResponse] = useState("");

	useEffect(() => {
	const handleCreateChannelSuccess = () => {
		onCancel();
		window.location.reload();
	};

	const handleCreateChannelError = (error: any) => {
		console.log("error when create channel");
		setErrorResponse(error.message); // Assuming error.message contains the error message
	};

	socket_chat.on("createChannelSuccess", handleCreateChannelSuccess);
	socket_chat.on("createChannelError", handleCreateChannelError);

	// Clean up event listeners when the component is unmounted
	return () => {
		socket_chat.off("createChannelSuccess", handleCreateChannelSuccess);
		socket_chat.off("createChannelError", handleCreateChannelError);
	};
	}, [socket_chat]); // not sure
	
	const handleConfirmClick = () => {
		

		// socket_chat.emit("createChannel", updateDTO);
	};

	return (
		<ModalContainer>
			<PopUpWrapper>
				<div className="header">
					<h2>&gt; New Chat</h2>
					<img src={iconSrc} alt="settings_icon" onClick={onCancel} />
				</div>
				<div className="join_channel">
					<AllChannelsList />
					<div className="buttons_container">
						<input></input>
						<ConfirmButton type="submit" onClick={handleConfirmClick}>Confirm</ConfirmButton>
					</div>
				</div>
			</PopUpWrapper>
		</ModalContainer>
	);
};