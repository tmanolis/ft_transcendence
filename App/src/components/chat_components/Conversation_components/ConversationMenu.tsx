import React from "react";
import { ChanMenuBar, ChanMenuElement, RedTextButton } from "./styles/ConversationMenu.styled";
import SettingsModal from "./ConversationSettingsModal";

interface ChannelMenuProps {
  onCloseMenu: () => void;
  chatRoom: Room;
  userName: string;
}

const ChannelMenu: React.FC<ChannelMenuProps> = ({ onCloseMenu, chatRoom, userName }) => {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  const handleUserButtonClick = () => {
    setIsSettingsModalVisible(true);
    onCloseMenu();
  }

  const handleSettingsButtonClick = () => {
    onCloseMenu();
  }

  const handleLeaveButtonClick = () => {
    onCloseMenu();
  }

  const closeSettingsModal = () => {
    setIsSettingsModalVisible(false);
  }

  return (
    <ChanMenuBar>
      <ChanMenuElement onClick={handleUserButtonClick}>Settings</ChanMenuElement>
      {chatRoom.role === "ADMIN" || chatRoom.role === "OWNER" ? (
        <ChanMenuElement onClick={handleSettingsButtonClick}>Settings</ChanMenuElement>
      ) : null}
      <RedTextButton onClick={handleLeaveButtonClick}>Leave Channel</RedTextButton>
      {isSettingsModalVisible && (
        <SettingsModal
          chatRoom={chatRoom}
          userName={userName}
          onClose={closeSettingsModal}
        />
      )}
    </ChanMenuBar>
  );
};

export default ChannelMenu;