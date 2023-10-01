import ConfirmButton from "../settings_components/styles/ConfirmButton.styled";
import ChatList from "./ChatList";
import { ChatNavigationStyled } from "./styles/ChatNavigation.styled";

const ChatNavigation: React.FC = () => {

	return (
		<ChatNavigationStyled>
			<ChatList />
			<div className="buttons">
				<ConfirmButton type="button">New Chat</ConfirmButton>
				<ConfirmButton type="button">New Channel</ConfirmButton>
			</div>
		</ChatNavigationStyled>
	);
};

export default ChatNavigation;