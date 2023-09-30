import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import BarCodeImg from "../../assets/code-barre.png";
import {
  ProfileAvatarStyled,
  AvatarImage,
  ProfileInfoBlock,
  UserStatus,
  CodeBar,
} from "./styles/ProfileAvatar.styled";

function toTitleCase(input: string) {
  return `• ${input
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")}`;
}

const ProfileAvatarBlock: React.FC = () => {
  const [avatarPath, setAvatarPath] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [userstatus, setUserstatus] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
          withCredentials: true,
        });
        setAvatarPath(response.data.avatar);
        setUsername(response.data.userName);
        setUserstatus(response.data.status);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [username, avatarPath]);

  const userImageSrc = `data:image/png;base64,${avatarPath}`;

  const EditedUserStatus = toTitleCase(userstatus);

  return (
    <ProfileAvatarStyled>
      <AvatarImage src={userImageSrc} />
      <ProfileInfoBlock>
        <h1>{username}</h1>
        <UserStatus status={userstatus}>{EditedUserStatus}</UserStatus>
      </ProfileInfoBlock>
      <CodeBar src={`${BarCodeImg}`} alt="code-barre" />
    </ProfileAvatarStyled>
  );
};

export default ProfileAvatarBlock;
