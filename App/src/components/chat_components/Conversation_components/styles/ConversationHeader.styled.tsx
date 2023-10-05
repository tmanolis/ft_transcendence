import styled from "styled-components";

export const ConversationHeaderWrapper = styled.div`
	display: flex;
	justify-content: space-between;
    align-items: center;

	height: 70px;
	padding-left: 15px;
	padding-right: 15px;
	border-bottom: solid 1px white;
	position: relative;

	img {
    width: 45px;
    height: 45px;
    position: relative;
    transition: transform 0.2s ease-in-out; /* Add a transition for smooth scaling */
    transform-origin: center; /* Set the transform origin to the center */

	cursor: pointer; /* Ensure the button remains clickable */
	background-color: black;
	z-index: 2;
	border-radius: 50%; /* Make the image circular by setting border-radius to 50% */
  }

  &:hover img {
    transform: scale(1.2); /* Scale up on hover */
  }

  @media screen and (max-width: 1480px) {
		width: 93%;
	}
`;

export const RoomName = styled.h2`
	margin: 0px;
`;