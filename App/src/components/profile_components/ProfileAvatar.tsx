import React from "react";
import BarCodeImg from "../../assets/code-barre.png";
import {
  ProfileAvatarStyled,
  AvatarImage,
  ProfileInfoBlock,
  UserStatus,
  CodeBar,
  SocialOption,
} from "./styles/ProfileAvatar.styled";

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

const ProfileAvatarBlock: React.FC<ProfileAvatarProps> = ({username, avatarPath, userstatus}) => {
  
  const userImageSrc = `data:image/png;base64,${avatarPath}`;

  const EditedUserStatus = toTitleCase(userstatus);

  return (
    <ProfileAvatarStyled>
      <AvatarImage src={userImageSrc} />
      <ProfileInfoBlock>
        <h1>{username}</h1>
        <UserStatus status={userstatus}>{EditedUserStatus}</UserStatus>
        <SocialOption>
          <button>+ Add</button>
          <button>x Block</button>
          <button>
            <span className="icon-before" /> Challenge Player
          </button>
        </SocialOption>
      </ProfileInfoBlock>
      <CodeBar src={`${BarCodeImg}`} alt="code-barre" />
    </ProfileAvatarStyled>
  );
};

export default ProfileAvatarBlock;
