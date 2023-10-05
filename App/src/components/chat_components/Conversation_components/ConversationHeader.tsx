import { ConversationHeaderWrapper, RoomName } from "./styles/ConversationHeader.styled";
import iconSrc from "../../../../public/icon/Settings.svg";
import { Room } from "../../../pages/Chat";

interface ConversationHeaderProps {
	chatRoom: Room;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ chatRoom }) => {
  
	const onClick =() => {
		console.log("click on settings icon");
	};

	return (
	  <ConversationHeaderWrapper>
		<RoomName>{chatRoom.name}</RoomName>
		<img src={iconSrc} alt="settings_icon" onClick={onClick}/>
	  </ConversationHeaderWrapper>
	)
  };
  
export default ConversationHeader;