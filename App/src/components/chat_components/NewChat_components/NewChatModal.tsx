import React from "react";
import { ModalContainer, PopUpWrapper } from "./styles/NewChatModal.styled";
import iconSrc from "../../../../public/icon/Cross.svg";
import { Socket } from "socket.io-client";
import AllChannelsList from "./AllChannelsList";
import JoinChannel from "./JoinChannel";
import ConfirmButton from "../../settings_components/styles/ConfirmButton.styled";

interface NewChatModalProps {
	onCancel: () => void;
	socket_chat: Socket
}
  
export const NewChatModal: React.FC<NewChatModalProps> = ({ onCancel, socket_chat }) => {

	return (
		<ModalContainer>
			<PopUpWrapper>
				<div className="header">
					<h2>&gt; New Chat</h2>
					<img src={iconSrc} alt="settings_icon" onClick={onCancel} />
				</div>
				<div className="lists_container">
					<div className="channel_container">
						<p>Send Direct Message</p>
						<AllChannelsList />
						<div className="buttons_container">
							<ConfirmButton type="submit">Confirm</ConfirmButton>
						</div>
					</div>
					<JoinChannel onCancel={onCancel} socket_chat={socket_chat} />
				</div>
			</PopUpWrapper>
		</ModalContainer>
	);
};