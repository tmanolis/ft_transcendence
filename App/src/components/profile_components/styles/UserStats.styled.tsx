import React from "react";
import styled from "styled-components";

export const UserStatsStyled = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-direction: column;	
	width: 531px;
	height: 208px;
	margin-left: 60px;
	margin-right: 35px;
	flex-shrink: 0; 
`;

export const UserStatsBlock = styled.div`
	width: 530px;
	height: 130px;
	flex-shrink: 0;
	border: 1px solid #FFF;
	background: #000;
	box-shadow: 1px 2px 1px 0px rgba(255, 255, 255, 0.90);

	h1{
		color: #FFF;
		font-size: 20px;
		font-style: normal;
		font-weight: 500;
		letter-spacing: 0.4px;
		margin: 0;
		text-align: center;
	}
`;

export const WinRateBlock = styled.div`
	display: flex;
	flex-direction: column;
	justify-content : space-between;

	div{
		width: 265px;
		margin: 2px;
	}

	p{
		color: #FFF;
		font-size: 20px;
		font-style: normal;
		font-weight: 500;
		letter-spacing: 0.2px;
		margin: 0;
		padding: 5px;
	}
`

export const Rank = styled.div`
	color: #FFF;
	font-size: 40px;
	font-style: normal;
	font-weight: 700;
	line-height: 70px; /* 175% */
	letter-spacing: 0.8px;
`;