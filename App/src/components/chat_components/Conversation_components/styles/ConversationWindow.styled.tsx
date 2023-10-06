import styled from "styled-components";

export const ConversationWindowWrapper = styled.div`
	border: solid 1px white;
	margin: 18px;
	width: 570px;

	.conversation_body {
		height: 485px;

		@media screen and (max-width: 1480px) {
			height: 345px;
		}
	}

	@media screen and (max-width: 1480px) {
		width: 92%;
	}
`;