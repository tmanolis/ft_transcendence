import React from "react";
import styled from "styled-components";
import NavBarSVG from "../../../../public/icon/navbar.svg"; // Import the SVG image
// import NavBarSVG from "../../../assets/navbar.png"; // Import the SVG image

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
  margin-top: 120px;
  left: 5px;
  gap: 45px;
  flex-shrink: 0;

  background-image: url(${NavBarSVG});
  background-size: contain;
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
