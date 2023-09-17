import React from "react";
import styled from "styled-components";

export type NavProps = {
  children?: React.ReactNode;
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: right;
`;

const StyledNavBar = styled.button`
  display: flex;
  margin-top: 100px;
  height: 450px;
  width: 80px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 45px;
  flex-shrink: 0;
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
