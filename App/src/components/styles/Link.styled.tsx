import styled from 'styled-components';
import React from 'react';

export type LinkProps = {
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	children?: React.ReactNode;
	disabled?: boolean;
}

const StyledLink = styled.button`
	background: none;
	color: #766e6e;
	align-items: right;
	font-family: 'JetBrains Mono', monospace;
	font-size: 75%;
	width: 100%;
	border: none;
	text-align: right;

	&:hover {
		background: black;
	}
`;

const Link: React.FC<LinkProps> = ({children}) => {
  return <StyledLink>{children}</StyledLink>;
};

export default Link;