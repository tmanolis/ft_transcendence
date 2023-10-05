import React, { useState, useEffect } from "react";
import { ChanMenuBar, ChanMenuElement, RedTextButton } from "./styles/ConversationMenu.styled";
import SettingsModal from "./ConversationSettingsModal";
import UsersListModal from "./ConversationUsersListModal";
import { Room } from "../../../pages/Chat";
import { createPortal } from "react-dom";
import { Socket } from "socket.io-client";

interface ChannelMenuProps {
  onCloseMenu: () => void;
  chatRoom: Room;
  userName: string;
  socket_chat: Socket
}

const ChannelMenu: React.FC<ChannelMenuProps> = ({ onCloseMenu, chatRoom, userName, socket_chat }) => {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [isUsersListModalVisible, setIsUsersListModalVisible] = useState(false);

  const handleUsersButtonClick = () => {
    setIsUsersListModalVisible(true);
  }

  const handleSettingsButtonClick = () => {
    setIsSettingsModalVisible(true);
  }

  const closeUsersListModal = () => {
    setIsUsersListModalVisible(false);
    onCloseMenu();
  }

  const closeSettingsModal = () => {
    setIsSettingsModalVisible(false);
    onCloseMenu();
  }

  useEffect(() => {
    const handleleaveChannelSuccess = () => {
      onCloseMenu();
      window.location.reload();
    };

    const handleleaveChannelError = () => {
      console.log("error when leaving channel");
    };

    socket_chat.on("leaveChannelSuccess", handleleaveChannelSuccess);
    socket_chat.on("leaveChannelError", handleleaveChannelError);

    return () => {
      socket_chat.off("leaveChannelSuccess", handleleaveChannelSuccess);
      socket_chat.off("leaveChannelError", handleleaveChannelError);
    };
  }, [socket_chat]);


  const handleLeaveButtonClick = () => {

    const updateDTO = {
      name: chatRoom.name,
    };

    socket_chat.emit("leaveChannel", updateDTO);
  };

  const isAdminOrOwner = chatRoom.role === "ADMIN" || chatRoom.role === "OWNER";

  return (
    <ChanMenuBar $isAdminOrOwner={isAdminOrOwner}>
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