import React from "react";
import Avatar, { AvatarProps } from "./styles/AvatarButton.styled";

const AvatarButton: React.FC<AvatarProps> = ({
  userImageSrc,
  avaBar,
  onClick,
}) => {
  return (
    <Avatar userImageSrc={userImageSrc} onClick={onClick} avaBar={avaBar} />
  );
};

export default AvatarButton;
