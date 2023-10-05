import React, { useEffect, useState } from "react";
import ConfirmButton from "../../settings_components/styles/ConfirmButton.styled";
import AllChannelsList from "./AllChannelsList";
import { Socket } from "socket.io-client";

interface JoinChannelProps {
	onCancel: () => void;
	socket_chat: Socket
}

const JoinChannel: React.FC<JoinChannelProps> = ({ onCancel, socket_chat }) => {
	const [channelName, setChannelName] = useState("");
	const [password, setPassword] = useState("");
  	const [errorResponse, setErrorResponse] = useState("");

	useEffect(() => {
	const handleJoinChannelSuccess = () => {
		onCancel();
		window.location.reload();
	};

	const handleJoinChannelError = (error: any) => {
		console.log("error when joining channel");
		setErrorResponse(error.message); // Assuming error.message contains the error message
	};

	socket_chat.on("joinChannelSuccess", handleJoinChannelSuccess);
	socket_chat.on("joinChannelError", handleJoinChannelError);

	// Clean up event listeners when the component is unmounted
	return () => {
		socket_chat.off("joinChannelSuccess", handleJoinChannelSuccess);
		socket_chat.off("joinChannelError", handleJoinChannelError);
	};
	}, [socket_chat]); // not sure
	
	const getChannelSelected =(name: string) => {
		setChannelName(name);
	}

	const handleConfirmClick = () => {
		
		const updateDTO = {
			name: channelName,
			password: password
		};

		socket_chat.emit("joinChannel", updateDTO);
	};

	return (
		<div className="channel_container">
			<p>Join Channel</p>
			<AllChannelsList getChannel={getChannelSelected}/>
			<div className="buttons_container">
				<input
					type="text"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="<type password here>"
				/>
				<ConfirmButton type="submit" onClick={handleConfirmClick}>Confirm</ConfirmButton>
			</div>
			{errorResponse && (
			<div style={{ color: "red", fontSize: "12px", padding: "5px" }}>{errorResponse}</div>)}
		</div>
	);
};

export default JoinChannel