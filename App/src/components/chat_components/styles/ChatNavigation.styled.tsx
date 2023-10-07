import styled from "styled-components";
import { StyledConfirmButton } from "../../settings_components/styles/ConfirmButton.styled";

export const ChatNavigationStyled = styled.div`

	/* border: solid 1px white; */
	margin: 18px;
	width: 350px;
	height: 604px;

	.buttons {
		margin-top: 10px;
		display: flex;
		justify-content: space-between; /* Horizontally justify the children */
	
		@media screen and (max-width: 1480px) {
			justify-content: flex-start;
			height: 80%;
			width: 80%;
			font-size: 12px;
  		}
	}

	${StyledConfirmButton} {
		width: 150px;
		height: 46px;
		color: #000;
		font-size: 15px;
		font-style: normal;
		font-weight: 500;
		letter-spacing: 0.36px;

			@media screen and (max-width: 1480px) {
			height: 80%;
			width: 80%;
			font-size: 12px;
  		}
	}

	@media screen and (max-width: 1480px) {
		display: flex;
		flex-direction : column;
		height: 20%;
		width: auto;
  }
`;