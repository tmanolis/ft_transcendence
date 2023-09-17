import React from "react";
import styled from "styled-components";

export type NavProps = {
  children?: React.ReactNode;
};

const StyledNavBar = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  align-items: flex-start;
  justify-content: flex-end;
  z-index: 1;
`;

const NewPageName = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  margin-top: -65px;
  right : 45px;
  width: 206px;
  height: 227px;
  flex-shrink: 0;
  border: 2px solid #FFF;
  background: #000;
  
  flex-shrink: 0;
  font-size: 12px;
  font-style: normal;
  letter-spacing: 0.5px;

    /* Hover styles */
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;

  h1:hover{
    color: #000;
  }

  h1 {
    margin: 0; /* Remove margin */
    display: flex;
    flex-direction: column;
    height: 100%; /* Set the height to 100% */
    justify-content: center;
  }

  a {
    display: flex;
    flex-direction: column;
    height: 100%; /* Set the height to 100% */
    justify-content: space-between;
    color: #FFF;
    text-decoration: none;

    border-bottom: 2px solid #FFF;
  }
  /* White line separator */
  /* a::before {
    content: "";
    width: 100%;
    height: 1px;
    background-color: #FFF;
    position: absolute;
    bottom: 0;
  } */
  
  a:hover {
    display: flex;
    justify-content: space-between;
    background-color: #FFF;
  }

  a:link,
  a:visited {
    color: #FFF;
    text-decoration: none;
  }
  
`;

const NavBar: React.FC<NavProps> = ({ children }) => {
  return (
    <StyledNavBar>
      <NewPageName>
        {children}
      </NewPageName>
    </StyledNavBar>
  );
};

export default NavBar;
