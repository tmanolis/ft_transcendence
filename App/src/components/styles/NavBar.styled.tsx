import React from "react";
import styled from "styled-components";

export type NavProps = {
  children?: React.ReactNode;
};

const StyledNavBar = styled.div`
  width: 160px;
  height: 522px;
  flex-shrink: 0;
  fill: #000;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

const NavBar: React.FC<NavProps> = ({ children }) => {
  return <StyledNavBar>{children}</StyledNavBar>;
};

export default NavBar;
