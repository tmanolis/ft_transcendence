import React from "react";
import styled from "styled-components";
import NavBarSVG from "../../../../public/icon/NavBar.svg"; // Import the SVG image

export type NavProps = {
  children?: React.ReactNode;
};

const NavBarStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
`;

const NavButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 450px;
  width: 80px;
  gap: 45px;
  flex-shrink: 0;

  background-image: url(${NavBarSVG});
  background-size: fit;
`;

const NavBar: React.FC<NavProps> = ({ children }) => {
  return (
    <NavBarStyled>
      <NavButton>
        {children}
      </NavButton>
    </NavBarStyled>
  );
};

export default NavBar;
