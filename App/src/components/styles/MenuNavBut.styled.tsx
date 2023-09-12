import React from "react";
import { styled } from "styled-components";

export type MenuNavProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}

const StyledMenuNavBut = styled.button<{}>`
  width: 90px;
  height: 90px;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  border: 5px solid #E3DCDC;
  background: rgba(217, 217, 217, 0.00);
  justify-content: center;
  align-items: center; /* Center the content vertically and horizontally */

  a {
    color: #FFF;
    text-align: center;
    font-family: JetBrains Mono;
    font-size: 45px;
    font-style: normal;
    font-weight: 500;
    line-height: 70px;
    letter-spacing: 0.9px;
    text-decoration: none;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  }
`;
const MenuNavBut: React.FC<MenuNavProps> = ({ children }) => {
  return (
    <StyledMenuNavBut>
      <a href="#">./</a>
    </StyledMenuNavBut>
  );
};

export default MenuNavBut;
