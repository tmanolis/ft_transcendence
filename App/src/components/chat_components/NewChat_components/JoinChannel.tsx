import React, { useEffect, useState } from "react";
import ConfirmButton from "../../settings_components/styles/ConfirmButton.styled";
import AllChannelsList from "./AllChannelsList";
import { Socket } from "socket.io-client";

interface JoinChannelProps {
	onCancel: () => void;
	socket_chat: Socket
}

const JoinChannel: React.FC<JoinChannelProps> = ({ onCancel, socket_chat }) => {
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
		<div className="channel_container">
			<p>Join Channel</p>
			<AllChannelsList />
			<div className="buttons_container">
				<input></input>
				<ConfirmButton type="submit" onClick={handleConfirmClick}>Confirm</ConfirmButton>
			</div>
		</div>
	);
};

export default JoinChannel