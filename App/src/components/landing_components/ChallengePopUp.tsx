import React, { useEffect, useState } from "react";
import { ModalContainer, PopUpWrapper } from "./styles/ChallengePopUp.styled";
import iconSrc from "/icon/Cross.svg";
import ConfirmButton from "../settings_components/styles/ConfirmButton.styled";
// import axios from "axios";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router";

interface ChallengePopUpProps {
	onCancel: () => void;
	invitedBy: string;
	socket_game: Socket;
}
  
export const ChallengePopUp: React.FC<ChallengePopUpProps> = ({ onCancel, invitedBy, socket_game }) => {
	// const [challengerName, setChallengerName] = useState("");
	const [waitingForGame, setWaitingForGame] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {

	const handleGameReady = () => {
		setWaitingForGame(false);
		onCancel();
		if (location.pathname !== "/pong")
        	navigate("/pong");
	};

	const handleRetroGameReady = () => {
		setWaitingForGame(false);
		onCancel();
		if (location.pathname !== "/retropong")
			navigate("/retropong");
	};

	socket_game.on("gameReady", handleGameReady);
	socket_game.on("retroGameReady", handleRetroGameReady);
	// Clean up event listeners when the component is unmounted
	return () => {
		socket_game.off("gameReady", handleGameReady);
		socket_game.off("retroGameReady", handleGameReady);
	};	
	}, [socket_game]);
	
	const handleDeclineClick = () => {
		socket_game.emit('declineInvitation', invitedBy);
		onCancel();
	}

	const handleAcceptClick = () => {
		socket_game.emit('acceptInvitation', invitedBy);
		setWaitingForGame(true);
	}
	
	// const getUsername = async () => {
	// 	try {
	// 	  const response = await axios.get(
	// 		`${import.meta.env.VITE_BACKEND_URL}user/userByEmail?email=${invitedBy}`, // need to create this endpoint in the back
	// 		{ withCredentials: true }
	// 	  );
	// 	  console.log(response);
	// 	  setChallengerName(response.data);
	// 	} catch (error) {
	// 	  console.log(error);
	// 	}
	//   };

	//   useEffect(() => {
	// 	getUsername();
	//   }, []);
						
	return (
		<ModalContainer>
			<PopUpWrapper>
				<div className="header">
					<h2>&gt; {invitedBy} challenged you to play</h2>
					<img src={iconSrc} alt="cross_icon" onClick={onCancel} />
				</div>
				{waitingForGame && <div>Waiting for game to be ready</div>}
				<div className="buttons_container">
					<ConfirmButton type="button" onClick={handleDeclineClick}>Decline</ConfirmButton>
					<ConfirmButton type="submit" onClick={handleAcceptClick}>Accept</ConfirmButton>
				</div>
			</PopUpWrapper>
		</ModalContainer>
	);
};