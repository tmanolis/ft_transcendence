import styled from 'styled-components';
import React from 'react';

export type ButtonProps = {
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	children?: React.ReactNode;
	disabled?: boolean;
}

const StyledButton = styled.button<{}>`
	border: none;
	background-color: black;
	color: white;
	padding: 1rem;
	border-radius: 5px;
	font-family: 'JetBrains Mono', monospace;
	width: 200px;
	margin: 1.5rem auto;
`;

const Button: React.FC<ButtonProps> = ({children}) => {
  return <StyledButton>{children}</StyledButton>;
};

export default Button;