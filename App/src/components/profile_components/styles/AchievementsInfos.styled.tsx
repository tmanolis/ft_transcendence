import styled from "styled-components";

export const AchievementsStyled = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-direction: column;	
	width: 531px;
	height: 208px;
	margin-left: 60px;
	margin-right: 35px;
	flex-shrink: 0; 

	h1{
		color: #FFF;
		font-size: 20px;
		font-style: normal;
		font-weight: 500;
		letter-spacing: 0.4px;
		padding-top: 5%;
		margin: 3px;
		text-align: right;
	}
`;

export const AchievementsBlock = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 530px;
	height: 130px;
	flex-shrink: 0;
	border: 1px solid #FFF;
	background: #000;
	box-shadow: 1px 2px 1px 0px rgba(255, 255, 255, 0.90);
`