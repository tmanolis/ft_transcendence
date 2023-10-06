import React, { useEffect, useState } from "react";
import ConfirmButton from "../../settings_components/styles/ConfirmButton.styled";
import { Socket } from "socket.io-client";
import AllUsersList from "./AllUsersList";

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

	socket_chat.on("createChannelSuccess", handleCreateChannelSuccess);
	socket_chat.on("createChannelError", handleCreateChannelError);

	// Clean up event listeners when the component is unmounted
	return () => {
		socket_chat.off("createChannelSuccess", handleCreateChannelSuccess);
		socket_chat.off("createChannelError", handleCreateChannelError);
	};
	}, [socket_chat]); // not sure
	
	const getChannelSelected =(name: string) => {
		setChannelName(name);
	}

	const handleConfirmClick = () => {
		
		const updateDTO = {
			name: channelName,
			status: 'DIRECT'
		};

		socket_chat.emit("createChannel", updateDTO);
	};

	return (
		<div className="channel_container">
			<p>Send Direct Message</p>
			<AllUsersList getUser={getChannelSelected}/>
			<div className="buttons_container" style={{ justifyContent: "flex-end" }}>
				<ConfirmButton type="submit" onClick={handleConfirmClick}>Confirm</ConfirmButton>
			</div>
			{errorResponse && (
			<div style={{ color: "red", fontSize: "12px", padding: "5px" }}>{errorResponse}</div>)}
		</div>
	);
};

export default JoinDirectMessage
