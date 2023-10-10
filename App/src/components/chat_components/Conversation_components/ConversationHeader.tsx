import { ConversationHeaderWrapper, RoomName } from "./styles/ConversationHeader.styled";
import iconSrc from "/src/assets/icon/Settings.svg";
import { Room } from "../../../pages/Chat";
import ChannelMenu from "./ConversationMenu";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Socket } from "socket.io-client";

interface ConversationHeaderProps {
  chatRoom: Room;
  roomName: string | null;
  socket_chat: Socket
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ chatRoom, roomName, socket_chat }) => {

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
      } catch (error: AxiosError) {
        console.error(error.message);
      }
    };

    fetchUserData();
  }, [username]);

  console.log(chatRoom);

  return (
    <ConversationHeaderWrapper>
      <RoomName>{roomName}</RoomName>
      <img src={iconSrc} alt="settings_icon" onClick={openCloseMenu} />
      {isMenuVisible && <ChannelMenu onCloseMenu={openCloseMenu} chatRoom={chatRoom} userName={username} socket_chat={socket_chat} />}
    </ConversationHeaderWrapper>
  )
};

export default ConversationHeader;
