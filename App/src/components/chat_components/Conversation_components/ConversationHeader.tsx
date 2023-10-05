import { ConversationHeaderWrapper, RoomName } from "./styles/ConversationHeader.styled";
import iconSrc from "../../../../public/icon/Settings.svg";
import { Room } from "../../../pages/Chat";
import ChannelMenu from "./ChannelMenu";
import { useState } from "react";

interface ConversationHeaderProps {
	chatRoom: Room;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ chatRoom }) => {
	
	const [isMenuVisible, setIsMenuVisible] = useState(false);

	const openCloseMenu =() => {
		setIsMenuVisible(!isMenuVisible);
	};

	return (
	  <ConversationHeaderWrapper>
		<RoomName>{chatRoom.name}</RoomName>
		<img src={iconSrc} alt="settings_icon" onClick={openCloseMenu}/>
		{isMenuVisible && <ChannelMenu onCloseMenu={openCloseMenu}/>}
	  </ConversationHeaderWrapper>
	)
  };
  
export default ConversationHeader;
