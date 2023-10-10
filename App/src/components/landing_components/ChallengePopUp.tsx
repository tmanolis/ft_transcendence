import React, { useEffect, useState } from "react";
import { ModalContainer, PopUpWrapper } from "./styles/ChallengePopUp.styled";
import iconSrc from "/icon/Cross.svg";
import ConfirmButton from "../settings_components/styles/ConfirmButton.styled";
import axios from "axios";

interface ChallengePopUpProps {
	onCancel: () => void;
	invitedBy: string;
}
  
export const ChallengePopUp: React.FC<ChallengePopUpProps> = ({ onCancel, invitedBy }) => {
	// const [challengerName, setChallengerName] = useState("");

	const handleDeclineClick = () => {
		// add socket emit for decline
		onCancel();
	}

	const handleAcceptClick = () => {

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
				<div className="buttons_container">
					<ConfirmButton type="button" onClick={handleDeclineClick}>Decline</ConfirmButton>
					<ConfirmButton type="submit" onClick={handleAcceptClick}>Accept</ConfirmButton>
				</div>
			</PopUpWrapper>
		</ModalContainer>
	);
};