import styled from "styled-components";
import React from "react";

export type ButtonProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
};

const StyledButton = styled.button<{}>`
  border: none;
  background-color: black;
  color: white;
  padding: 1rem;
  border-radius: 5px;
  font-family: "JetBrains Mono", monospace;
  width: 200px;
  margin: 1.5rem auto;

  a {
    text-decoration: none;
    color: white;
  }

  img {
    width: 20px;
    height: auto;
    margin-right: 10px;
  }
`;



const Button: React.FC<ButtonProps> = ({ type, onClick, children }) => {
  return (
    <StyledButton type={type} onClick={onClick}>
      {children}
    </StyledButton>
  );
};

export default Button;
