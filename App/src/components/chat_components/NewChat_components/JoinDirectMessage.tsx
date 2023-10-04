import React, { useEffect, useState } from "react";
import ConfirmButton from "../../settings_components/styles/ConfirmButton.styled";
import AllChannelsList from "./AllChannelsList";
import { Socket } from "socket.io-client";

interface JoinDirectMessageProps {
	onCancel: () => void;
	socket_chat: Socket
}

const JoinDirectMessage: React.FC<JoinDirectMessageProps> = ({ onCancel, socket_chat }) => {
	const [channelName, setChannelName] = useState("");
  	const [errorResponse, setErrorResponse] = useState("");

	useEffect(() => {
	const handleCreateChannelSuccess = () => {
		onCancel();
		window.location.reload();
	};

	const handleCreateChannelError = (error: any) => {
		console.log("error when joining channel");
		setErrorResponse(error.message); // Assuming error.message contains the error message
	};

	socket_chat.on("CreateChannelSuccess", handleCreateChannelSuccess);
	socket_chat.on("CreateChannelError", handleCreateChannelError);

	// Clean up event listeners when the component is unmounted
	return () => {
		socket_chat.off("CreateChannelSuccess", handleCreateChannelSuccess);
		socket_chat.off("CreateChannelError", handleCreateChannelError);
	};
	}, [socket_chat]); // not sure
	
	const getChannelSelected =(name: string) => {
		setChannelName(name);
	}

	const handleConfirmClick = () => {
		
		const updateDTO = {
			name: channelName,
			status: 'PRIVATE'
		};

		socket_chat.emit("createChannel", updateDTO);
	};

	return (
		<div className="channel_container">
			<p>Send Direct Message</p>
			<AllChannelsList getChannel={getChannelSelected}/>
			<div className="buttons_container">
			<ConfirmButton type="submit" onClick={handleConfirmClick}>Confirm</ConfirmButton>
			</div>
			{errorResponse && (
			<div style={{ color: "red", fontSize: "12px", padding: "5px" }}>{errorResponse}</div>)}
		</div>
	);
};

export default JoinDirectMessage