import { createPortal } from "react-dom";
import ConfirmButton from "../settings_components/styles/ConfirmButton.styled";
import ChatList from "./UserChatList";
import { ChatNavigationStyled } from "./styles/ChatNavigation.styled";
import { CreateChannelModal } from "./CreateChannelModal";
import { useState } from "react";
import { Socket } from "socket.io-client";
import { Room } from "../../pages/Chat";
import { NewChatModal } from "./NewChatModal";

interface ChatNavigationProps {
	openChat: (room: Room) => void;
	socket_chat: Socket
}

const ChatNavigation: React.FC<ChatNavigationProps> = ({ openChat, socket_chat }) => {
	const [createChannelModalOpen, setCreateChannelModalOpen] = useState(false);
	const [newChatModalOpen, setNewChatModalOpen] = useState(false);

	const handleNewChat = () => {
		setNewChatModalOpen(true);
	}

	const handleCreateChannel = () => {
		setCreateChannelModalOpen(true);
	}

	const handleCancelClick = () => {
		setCreateChannelModalOpen(false);
		setNewChatModalOpen(false);
	  };

	return (
		<ChatNavigationStyled>
			<ChatList openChat={openChat}/>
			<div className="buttons">
				<ConfirmButton type="button" onClick={handleNewChat} >New Chat</ConfirmButton>
				<ConfirmButton type="button" onClick={handleCreateChannel}>Create Channel</ConfirmButton>
			</div>
			{newChatModalOpen &&
			createPortal(
			<NewChatModal onCancel={handleCancelClick} socket_chat={socket_chat} />,
			document.body
			)}
			{createChannelModalOpen &&
			createPortal(
			<CreateChannelModal onCancel={handleCancelClick} socket_chat={socket_chat} />,
			document.body
			)}
		</ChatNavigationStyled>
	);
};

export default ChatNavigation;