import { Room } from "../../../pages/Chat";
import ConversationFooter from "./ConversationFooter";
import ConversationHeader from "./ConversationHeader";

interface ConversationWindowProps {
	chatRoom: Room;
}

const ConversationWindow: React.FC<ConversationWindowProps> = ({ chatRoom }) => {

	return (
		<>
			<ConversationHeader chatRoom={chatRoom} />
			<div className="conversation_body" />
			<ConversationFooter />
		</>
	)
};

export default ConversationWindow;