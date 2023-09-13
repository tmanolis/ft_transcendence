import React from "react";
import Avatar from "./styles/AvatarButton.styled"

const userImageSrc = "../../public/icon/Avatar.svg";

const AvatarButton: React.FC = () => {
  const handleAvatarClick = () => {
  };

  return (
      <Avatar userImageSrc={userImageSrc} onClick={handleAvatarClick} />
  );
};

export default AvatarButton;
