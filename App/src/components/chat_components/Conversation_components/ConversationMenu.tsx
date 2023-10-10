import React, { useState, useEffect } from "react";
import { ChanMenuBar, ChanMenuElement, RedTextButton } from "./styles/ConversationMenu.styled";
import SettingsModal from "./ConversationSettingsModal";
import UsersListModal from "./ConversationUsersListModal";
import { Room } from "../../../pages/Chat";
import { createPortal } from "react-dom";
import { Socket } from "socket.io-client";
import { UserInfoProps } from "./ConversationUserInfo"
import axios, { AxiosError } from "axios";

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

  const isOwner = chatRoom.role === "OWNER";

  const [usersList, setUsersList] = useState<UserInfoProps['user'][]>([]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace "%23" with "#"
        const formattedRoomName = encodeURIComponent(chatRoom.name.replace('%23', '#'));
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/channel/members?name=${formattedRoomName}`,
          {
            withCredentials: true,
          }
        );
        setUsersList(response.data.membersList);
      } catch (error: AxiosError) {
        console.error(error.message);
      }
    };
    fetchUserData();
  }, [chatRoom]);

  const user = usersList.find(user => user.userName === userName);
  const isUserBanned = user && user.isBanned;

  return (
    <ChanMenuBar $isOwner={isOwner}>
      <ChanMenuElement onClick={handleUsersButtonClick}>&gt; Users</ChanMenuElement>
      {isOwner && (
        <ChanMenuElement onClick={handleSettingsButtonClick}>&gt; Settings</ChanMenuElement>
      )}
      {chatRoom.status !== "DIRECT" && (
        isUserBanned ? (
          <RedTextButton disabled>{'! You are Banned !'}</RedTextButton>
        ) : (
          <RedTextButton onClick={handleLeaveButtonClick}>&gt; Leave Channel</RedTextButton>
        )
      )}
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