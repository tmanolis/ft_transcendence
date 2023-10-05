import { ConversationHeaderWrapper, RoomName } from "./styles/ConversationHeader.styled";
import iconSrc from "../../../../public/icon/Settings.svg";
import { Room } from "../../../pages/Chat";
import ChannelMenu from "./ConversationMenu";
import { useState, useEffect } from "react";
import axios from "axios";
import { Socket } from "socket.io-client";

interface ConversationHeaderProps {
  chatRoom: Room;
  socket_chat: Socket
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ chatRoom }) => {

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [username, setUsername] = useState<string>("");

  const openCloseMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
          withCredentials: true,
        });
        setUsername(response.data.userName);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [username]);

  console.log(chatRoom);

  return (
    <ConversationHeaderWrapper>
      <RoomName>{chatRoom.name}</RoomName>
      <img src={iconSrc} alt="settings_icon" onClick={openCloseMenu} />
      {isMenuVisible && <ChannelMenu onCloseMenu={openCloseMenu} chatRoom={chatRoom} userName={username} />}
    </ConversationHeaderWrapper>
  )
};

export default ConversationHeader;
