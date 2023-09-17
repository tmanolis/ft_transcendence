import React from "react";
import styled from "styled-components";

export type AvatarProps = {
  userImageSrc: string;
  onClick: () => void;
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
  border: 2px solid transparent; /* Transparent border to create space for the gradient */
  border-top: 0px;
  border-bottom: 2px solid #b9b9b9;
  background-image: linear-gradient(to bottom, #000000, #3b3b3b, #777777, #b9b9b9, #ffffff);

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
