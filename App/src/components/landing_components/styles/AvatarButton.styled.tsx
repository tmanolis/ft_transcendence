import React from "react";
import styled from "styled-components";

export type AvatarProps = {
  userImageSrc: string;
  onClick: () => void;
  avaBar: boolean;
};

const StyledAvatar = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Avatar: React.FC<AvatarProps> = ({ userImageSrc, onClick }) => {
  return (
    <StyledAvatar onClick={onClick}>
      <AvatarImage src={userImageSrc} alt="User Avatar" />
    </StyledAvatar>
  );
};

export default Avatar;
