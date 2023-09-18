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
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  z-index: 2;
  border-radius: 73px;
  border: 2px solid var(--linear-white, #FAF2F2);
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
