import React, { useState } from "react";
import { ChanMenuBar, ChanMenuElement, RedTextButton } from "./styles/ConversationMenu.styled";
import SettingsModal from "./ConversationSettingsModal";
import { Room } from "../../../pages/Chat";
// import { createPortal } from "react-dom";

interface ChannelMenuProps {
  onCloseMenu: () => void;
  chatRoom: Room;
  userName: string;
}

const ChannelMenu: React.FC<ChannelMenuProps> = ({ onCloseMenu, chatRoom, userName }) => {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  const handleUsersButtonClick = () => {
    onCloseMenu();
  }

  const handleSettingsButtonClick = () => {
    setIsSettingsModalVisible(true);
  }

  const handleLeaveButtonClick = () => {
    onCloseMenu();
  }

  const closeSettingsModal = () => {
    setIsSettingsModalVisible(false);
    onCloseMenu();
  }

  return (
    <ChanMenuBar>
      <ChanMenuElement onClick={handleUsersButtonClick}>Users</ChanMenuElement>
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