import React from "react";
import { styled } from "styled-components";

export type PopUpProps = {
	children?: React.ReactNode;
}

const StyledPopUp = styled.div`
	position: absolute;
	width: 238px;
	height: 178px;
	left: 263px;
	top: 513px;
	left: calc(50% - 238px/2 - 338px);
	top: calc(50% - 178px/2 + 90px);

	background: rgba(255, 255, 255, 0.9);
	box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.25);
	border-radius: 8px;

	display: flex;
	flex-direction: column;
	
	font-family: 'JetBrains Mono';
	font-style: normal;
	font-weight: 500;
	color: black;
	letter-spacing: 0.02em;

	p {
		line-height: 19px;
		margin: 16px 16px 0;
		display: flex;
		align-items: center;
		letter-spacing: 0.02em;
		display: block;
		color: black;
		font-size: 12px;
	}

	ul {
		line-height: 160%;
		margin: 4px 0px 0;
		display: flex;
		align-items: center;
		display: block;
		color: black;
		font-size: 12px;
	}
`
const PopUp: React.FC<PopUpProps> = ({children}) => {
	return <StyledPopUp>{children}</StyledPopUp>;
};

export default PopUp;