import { Socket } from "socket.io-client";
import { Room } from "../../../pages/Chat";
import ConversationFooter from "./ConversationFooter";
import ConversationHeader from "./ConversationHeader";

interface ConversationWindowProps {
	chatRoom: Room;
	socket_chat: Socket
}

const ConversationWindow: React.FC<ConversationWindowProps> = ({ chatRoom, socket_chat }) => {

	return (
		<>
			<ConversationHeader chatRoom={chatRoom} socket_chat={socket_chat} />
			<div className="conversation_body" />
			<ConversationFooter chatRoom={chatRoom} socket_chat={socket_chat} />
		</>
	)
};

export default ConversationWindow;