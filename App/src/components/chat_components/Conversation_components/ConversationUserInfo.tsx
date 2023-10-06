import React, { useState, useEffect} from "react";
import axios from "axios"
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
  const [avatarPath, setAvatarPath] = useState("");
  const [status, setStatus] = useState("");

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

