import React from "react";
import styled from "styled-components";
// import NavBarSVG from "../../../../public/icon/navbar.svg";
import NavBarPNG from "../../../assets/navbar.png"; // Import the SVG image

export type NavProps = {
  children?: React.ReactNode;
};

const NavBarStyled = styled.div`
  display: flex;
  width: 100%;
  position: absolute;
  z-index: 1;
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

  background-image: url(${NavBarPNG});
  background-size: cover;
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
