import React, { useState, useEffect } from "react";
import axios from "axios"
import { UserBannerStyled, UserDetails, SocialActions, ActionButtons } from "./styles/ConversationUserInfo.styled";
import banIcon from "../../../assets/icon/BanUser.png";
import kickIcon from "../../../assets/icon/KickUser.png";
import muteIcon from "../../../assets/icon/MuteUser.png";

interface UserInfoProps {
  user: {
    userName: string;
    isBanned: boolean;
    isMuted: boolean;
    isBlocked: boolean;
  };
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const [avatarPath, setAvatarPath] = useState("");
  const [status, setStatus] = useState("");

  console.log(avatarPath, status);
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

  // onBanClick(() => {

  // });

  // onKickClick(() => {

  // });

  // onMuteClick(() => {

  // });

  return (
    <UserBannerStyled>
      <UserDetails>
        <img
          src={`data:image/png;base64,${avatarPath}`}
          alt={`Avatar of ${user.userName}`}
        />
        <p>{user.userName}</p>
        <SocialActions>
          <ActionButtons isActive={user.isBanned}
            src={banIcon}
            alt="Ban"
          // onClick={onBanClick}
          />
          <ActionButtons isActive={user.isKick}
            src={kickIcon}
            alt="Kick"
          // onClick={onKickClick}
          />
          <ActionButtons isActive={user.isMute}
            src={muteIcon}
            alt="Mute"
          // onClick={onMuteClick}
          />
        </SocialActions>
        <p>{status}</p>
      </UserDetails>
    </UserBannerStyled>
  );
};

export default UserInfo;

