import React from "react";
import styled from "styled-components";
// import NavBarSVG from "../../../../public/icon/navbar.svg";
import NavBarPNG from "../../../assets/navbar.png"; // Import the SVG image

export type NavProps = {
  children?: React.ReactNode;
};

const NavBarStyled = styled.div`
  display: flex;
  width: 130px;
  height: 508px;
  margin-top: 120px;
  position: absolute;
  z-index: 1;

  background-image: url(${NavBarPNG});
`;

const NavButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-items: flex-end;
  height: 450px;
  width: 80px;
  left: 5px;
  gap: 45px;
  /* flex-shrink: 0; */

  img {
    transition:
      transform 0.1s,
      border 0.1s;
  }

  img:hover {
    transform: scale(1.3);
    /* border: 3px solid #fff; */
  }
`;

const NavBar: React.FC<NavProps> = ({ children }) => {
  return (
    <NavBarStyled>
      <NavButton>{children}</NavButton>
    </NavBarStyled>
  );
};

export default NavBar;

