import React, { useEffect, useState } from "react";
import BarCodeImg from "../../assets/code-barre.png";
import {
  ProfileAvatarStyled,
  AvatarImage,
  ProfileInfoBlock,
  UserStatus,
  CodeBar,
  SocialOption,
} from "./styles/ProfileAvatar.styled";
import axios from "axios";

type ProfileAvatarProps = {
  avatarPath: string;
  username: string;
  userstatus: string;
};

function toTitleCase(input: string) {
  return `• ${input
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")}`;
}

const ProfileAvatarBlock: React.FC<ProfileAvatarProps> = ({
  username,
  avatarPath,
  userstatus,
}) => {
  const [userName, setUserName] = useState<string>("");
  const userImageSrc = `data:image/png;base64,${avatarPath}`;
  const EditedUserStatus = toTitleCase(userstatus);

  const isOwnProfile = username === userName;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/me`,
          {
            withCredentials: true,
          }
        );
        setUserName(response.data.userName);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <ProfileAvatarStyled>
      <AvatarImage src={userImageSrc} />
      <ProfileInfoBlock>
        <h1>{username}</h1>
        <UserStatus $userstatus={userstatus}>{EditedUserStatus}</UserStatus>
        <>
          {!isOwnProfile && (
            <SocialOption>
              <button>+ Add</button>
              <button>x Block</button>
              <button>
                <span className="icon-before" /> Challenge Player
              </button>
            </SocialOption>
          )}
        </>
      </ProfileInfoBlock>
      <CodeBar src={`${BarCodeImg}`} alt="code-barre" />
    </ProfileAvatarStyled>
  );
};

export default ProfileAvatarBlock;
