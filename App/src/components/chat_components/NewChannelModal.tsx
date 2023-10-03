import React, { useState } from "react";
import { ModalContainer, PopUpWrapper } from "./styles/NewChannelModal.styled";
import ConfirmButton from "../settings_components/styles/ConfirmButton.styled";
import { Socket } from "socket.io-client";

interface NewChannelModalProps {
	onCancel: () => void;
	socket_chat: Socket
  }
  
export const NewChannelModal: React.FC<NewChannelModalProps> = ({ onCancel, socket_chat }) => {
	const [channelName, setChannelName] = useState("");
	const [password, setPassword] = useState("");
  	const [errorResponse, setErrorResponse] = useState("");

	const handleConfirmClick = () => {
		let status: string;

		if (password === "")
			status = 'PUBLIC';
		else
			status = 'PRIVATE';

		console.log("channelName: " + channelName);
		console.log("password: " + password);
		
		const updateDTO = {
			name: "#" + channelName,
			status: status,
			password: password
		};

		try {
			socket_chat.emit("createChannel", updateDTO);
			onCancel();
			} catch (error) {
				setErrorResponse("lol");
				// console.log(error);
			// handleUpdateError(error);
			}
		};

		// useEffect(() => {
		// 	socket.on("createChannelSuccess", (error) => {
		// 		console.log(": ", error);
		// 	});

		// 	socket.on("createChannelError", (error) => {
		// 		console.log(": ", error);
		// 	});

		// }, []);

	// const handleUpdateError = (error) => {
	// 	console.log(error.response)
	// 	if (error.response) {
	// 		setErrorResponse("This channel name already exist or the name is not valid");
	// 		setChannelName("");
	// 		setPassword("");
	// 	};
	// };

	return (
		<ModalContainer>
			<PopUpWrapper>
				<h2>&gt; Create Channel</h2>
				<div className="form_container">
					<label>Channel name</label>
					<input
					type="text"
					value={channelName}
					onChange={(e) => setChannelName(e.target.value)} // Update channelName
					placeholder="<type name here>"
					/>
					<label style = {{marginTop: "20px"}}>Password</label>
					<input
					type="text"
					value={password}
					onChange={(e) => setPassword(e.target.value)} // Update channelName
					placeholder="<type password here>"
					/>
					<span>only to create a private channel<br></br>&gt; no password: channel = public</span>
					{errorResponse && (
					<div style={{ color: "red", fontSize: "12px", padding: "5px" }}>{errorResponse}</div>)}
				</div>
				<div className="buttons_container">
					<ConfirmButton type="button" onClick={onCancel}>Cancel</ConfirmButton>
					<ConfirmButton type="submit" onClick={handleConfirmClick}>Confirm</ConfirmButton>
				</div>
			</PopUpWrapper>
		</ModalContainer>
	);
};