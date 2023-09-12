import React from "react";
import styled from "styled-components";
import Avatar from "./styles/AvatarButton.styled"

const Container = styled.div`
  position: relative;
`;

const userImageSrc = "../../public/icon/Avatar.svg";

const AvatarButton: React.FC = () => {
  const handleAvatarClick = () => {
  };

  return (
    <Container>
      <Avatar userImageSrc={userImageSrc} onClick={handleAvatarClick} />
    </Container>
  );
};

export default AvatarButton;
