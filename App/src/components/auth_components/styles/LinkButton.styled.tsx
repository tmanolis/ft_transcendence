import styled from "styled-components";
import React from "react";

export type LinkProps = {
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
};

const StyledLink = styled.button`
  background: none;
  color: #766e6e;
  font-family: "JetBrains Mono", monospace;
  font-size: 75%;
  width: 100%;
  border: none;
  text-align: right;

  span {
    margin-right: 11px;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const LinkButton: React.FC<LinkProps> = ({ onClick, children }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <StyledLink onClick={handleClick}>
      <span>{children}</span>
    </StyledLink>
  );
};

export default LinkButton;
