import React, { useState, useEffect } from "react";
import axios from "axios"
import { UserBannerStyled, UserDetails, SocialActions, ActionButtons, UserStatus } from "./styles/ConversationUserInfo.styled";
import { Room } from "../../../pages/Chat";
import banIcon from "../../../assets/icon/BanUser.png";
import kickIcon from "../../../assets/icon/KickUser.png";
import muteIcon from "../../../assets/icon/MuteUser.png";
import adminIcon from "../../../assets/icon/AdminUser.png";

interface UserInfoProps {
  user: {
    userName: string;
    isBanned: boolean;
    isMuted: boolean;
    isBlocked: boolean;
  };
  chatRoom: Room;
}

function toTitleCase(input: string) {
  return `${input
    .toLowerCase()
    .split(" ")
    .join(" ")}`;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, chatRoom }) => {
  const [avatarPath, setAvatarPath] = useState("");
  const [status, setStatus] = useState("");
  const EditedUserStatus = toTitleCase(status);

  console.log(user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user.userName) { // Check if versUsername is defined
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/user/userByUsername?userName=${user.userName}`,
            {
              withCredentials: true,
            }
          );
          setAvatarPath(response.data.avatar);
          setStatus(response.data.status);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [user]);

  const banUser = async () => {
    const updateDTO = {
      username: user.userName,
      channel: chatRoom.name,
    };
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/channel/ban`,
        updateDTO,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const unBanUser = async () => {
    const updateDTO = {
      username: user.userName,
      channel: chatRoom.name,
    };
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/channel/unban`,
        updateDTO,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleBanClick = async () => {
    if (user.isBanned) {
      try {
        const response = await unBanUser();
        console.log(response?.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await banUser();
        console.log(response?.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const KickUser = async () => {
    const updateDTO = {
      username: user.userName,
      channel: chatRoom.name,
    };
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/channel/kick`,
        updateDTO,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleKickClick = async () => {
    try {
      const response = await KickUser();
      console.log(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const MuteUser = async () => {
    const updateDTO = {
      username: user.userName,
      channel: chatRoom.name,
    };
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/channel/mute`,
        updateDTO,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleMuteClick = async () => {
    try {
      const response = await MuteUser();
      console.log(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const setAdminUser = async () => {
    const updateDTO = {
      username: user.userName,
      channel: chatRoom.name,
    };
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/channel/addAdmin`,
        updateDTO,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const unsetAdminUser = async () => {
    const updateDTO = {
      username: user.userName,
      channel: chatRoom.name,
    };
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/channel/removeAdmin`,
        updateDTO,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdminClick = async () => {
    if (user.isBanned) {
      try {
        const response = await setAdminUser();
        console.log(response?.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await unsetAdminUser();
        console.log(response?.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <UserBannerStyled>
      <UserDetails>
        <img
          src={`data:image/png;base64,${avatarPath}`}
          alt={`Avatar of ${user.userName}`}
        />
        <p>{user.userName}</p>
        {chatRoom.role !== "USER" && (
          <SocialActions>
            <ActionButtons
              $isactive={user.isBanned}
              src={banIcon}
              alt="Ban"
              onClick={handleBanClick}
            />
            <ActionButtons
              src={kickIcon}
              alt="Kick"
              onClick={handleKickClick}
            />
            <ActionButtons
              $isactive={user.isMuted}
              src={muteIcon}
              alt="Mute"
              onClick={handleMuteClick}
            />
            <ActionButtons
              src={adminIcon}
              alt="Admin"
              onClick={handleAdminClick}
            />
          </SocialActions>
        )}
        <UserStatus $userstatus={status}>{EditedUserStatus}</UserStatus>
      </UserDetails>
    </UserBannerStyled>
  );
};

export default UserInfo;

