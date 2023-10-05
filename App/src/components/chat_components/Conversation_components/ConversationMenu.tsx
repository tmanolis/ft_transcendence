import React, { useState } from "react";
import { ChanMenuBar, ChanMenuElement, RedTextButton } from "./styles/ConversationMenu.styled";
import SettingsModal from "./ConversationSettingsModal";
import UsersListModal from "./ConversationUsersListModal";
import { Room } from "../../../pages/Chat";
// import { createPortal } from "react-dom";

interface ChannelMenuProps {
  onCloseMenu: () => void;
  chatRoom: Room;
  userName: string;
}

const ChannelMenu: React.FC<ChannelMenuProps> = ({ onCloseMenu, chatRoom, userName }) => {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [isUsersListModalVisible, setIsUsersListModalVisible] = useState(false);

  const handleUsersButtonClick = () => {
    setIsUsersListModalVisible(true);
  }

  const handleSettingsButtonClick = () => {
    setIsSettingsModalVisible(true);
  }

  const handleLeaveButtonClick = () => {
    onCloseMenu();
  }

  const closeUsersListModal = () => {
    setIsUsersListModalVisible(false);
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
      {isUsersListModalVisible && (
        <UsersListModal
          chatRoom={chatRoom}
          userName={userName}
          onClose={closeUsersListModal}
        />
      )}
    </ChanMenuBar>
  );
};

export default ChannelMenu;