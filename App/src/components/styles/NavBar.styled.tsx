import React from "react";
import styled from "styled-components";
import NavBarSVG from "../../../public/icon/NavBar.svg"; // Import the SVG image

export type NavProps = {
  children?: React.ReactNode;
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
`;

const StyledNavBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 45px;
  flex-shrink: 0;

  background-image: url(${NavBarSVG});
  background-size: cover;
`;

const NavBar: React.FC<NavProps> = ({ children }) => {
  return (
    <Container>
      <StyledNavBar>
        {children}
      </StyledNavBar>
    </Container>
  );
};

export default NavBar;
