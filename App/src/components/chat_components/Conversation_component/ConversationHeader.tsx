import { ConversationHeaderWrapper } from "./styles/ConversationHeader.styled";


interface ConversationHeaderProps {
	chatName: string;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ chatName }) => {
  
	return (
	  <ConversationHeaderWrapper>
		{chatName}
	  </ConversationHeaderWrapper>
	)
  };
  
export default ConversationHeader;