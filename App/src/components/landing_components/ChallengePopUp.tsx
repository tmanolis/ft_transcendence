import React from "react";
import { ModalContainer, PopUpWrapper } from "./styles/ChallengePopUp.styled";
import iconSrc from "/icon/Cross.svg";
import ConfirmButton from "../settings_components/styles/ConfirmButton.styled";

interface ChallengePopUpProps {
	onCancel: () => void;
	invitedBy: string;
}
  
export const ChallengePopUp: React.FC<ChallengePopUpProps> = ({ onCancel, invitedBy }) => {

	const handleDeclineClick = () => {
		// add socket emit for decline
		onCancel();
	}

	const handleAcceptClick = () => {

	}

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