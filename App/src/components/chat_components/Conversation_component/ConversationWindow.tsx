import ConversationFooter from "./ConversationFooter";
import ConversationHeader from "./ConversationHeader";
import { ConversationWindowWrapper } from "./styles/ConversationWindow.styled";

interface ConversationWindowProps {
	chatName: string;
}

const ConversationWindow: React.FC<ConversationWindowProps> = ({ chatName }) => {
  
	return (
	  <ConversationWindowWrapper>
		<ConversationHeader chatName={chatName} />
		<div className="conversation_body" />
		<ConversationFooter />
	  </ConversationWindowWrapper>
	)
  };
  
export default ConversationWindow;