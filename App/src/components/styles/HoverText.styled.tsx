import React, { useState } from "react";
import { styled } from "styled-components";
import PasswordPopUp from "../PasswordPopUp";

export type TextProps = {
	children?: React.ReactNode;
}

const StyledHoverText = styled.div`
	width: 360px;
	height: 12px;
	align-items: center;

	font-family: 'JetBrains Mono';
	font-style: normal;
	font-weight: 500;
	font-size: 10px;
	line-height: 13px;
	display: flex;

	p {
		font-size: 10px;
		color: #929292;
	}
`;

const HoverText: React.FC<TextProps> = ({ children }) => {
	const [isHovered, setHovered] = useState(false);

	const handleMouseEnter = () => {
		setHovered(true);
	};

	const handleMouseLeave = () => {
		setHovered(false);
	};	

	return <StyledHoverText
		onMouseEnter={handleMouseEnter}
		onMouseLeave={handleMouseLeave}
	>
		{children}
		{isHovered && <PasswordPopUp />}
		</StyledHoverText>;
};

export default HoverText;