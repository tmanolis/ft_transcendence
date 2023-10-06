import React from "react";
import { UserBannerStyled, UserDetails } from "./styles/ConversationUserInfo.styled";

interface UserInfoProps {
	user: {
	  userName: string;
	  isBanned: boolean;
	  isMuted: boolean;
	  isBlocked: boolean;
	};
  }

  const UserInfo: React.FC<UserInfoProps> = ({ user }) => {

	return (
		<UserBannerStyled>
		  <UserDetails>
        <p>Username: {user.userName}</p>
        <p>Banned: {user.isBanned ? "Yes" : "No"}</p>
        <p>Muted: {user.isMuted ? "Yes" : "No"}</p>
        <p>Blocked: {user.isBlocked ? "Yes" : "No"}</p>
			</UserDetails>
		</UserBannerStyled>
	);
};

export default UserInfo;

