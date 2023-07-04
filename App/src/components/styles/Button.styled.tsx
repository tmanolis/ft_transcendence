import styled from 'styled-components';
import React from 'react';

export type ButtonProps = {
	onClick?: (e: React.FormEvent) => void;
	children?: React.ReactNode;
	disabled?: boolean;
	type?: "button" | "submit" | "reset" | undefined;
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

const Button: React.FC<ButtonProps> = ({ type, onClick, children }) => {
  return <StyledButton type={type} onClick={onClick}>{children}</StyledButton>;
};

export default Button;