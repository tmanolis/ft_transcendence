import React, { useState } from "react";
import { ChanMenuBar, ChanMenuElement, RedTextButton } from "./styles/ConversationMenu.styled";
import SettingsModal from "./ConversationSettingsModal";
import UsersListModal from "./ConversationUsersListModal";
import { Room } from "../../../pages/Chat";
import { createPortal } from "react-dom";

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

  const isAdminOrOwner = chatRoom.role === "ADMIN" || chatRoom.role === "OWNER";

  return (
    <ChanMenuBar isAdminOrOwner={isAdminOrOwner}>
      <ChanMenuElement onClick={handleUsersButtonClick}>&gt; Users</ChanMenuElement>
      {isAdminOrOwner && (
        <ChanMenuElement onClick={handleSettingsButtonClick}>&gt; Settings</ChanMenuElement>
      )}
      <RedTextButton onClick={handleLeaveButtonClick}>&gt; Leave Channel</RedTextButton>
      {isSettingsModalVisible && createPortal(
        <SettingsModal
          chatRoom={chatRoom}
          userName={userName}
          onClose={closeSettingsModal}
          />, document.body
      )}
      {isUsersListModalVisible && createPortal(
        <UsersListModal
          chatRoom={chatRoom}
          userName={userName}
          onClose={closeUsersListModal}
        />, document.body
      )}
    </ChanMenuBar>
  );
};

export default ChannelMenu;