import styled from 'styled-components'; // Import styled-components

export const ProfilesListWrapper = styled.div`
	width: 960px;
	height: 574px;
	margin: 15px;
	padding: 15px;
	overflow: auto; // Add overflow to allow scrolling if content overflows
`;

export const ProfileContainer = styled.div`
	height: 78px;
	border: 1px;

	display: flex; // Align children horizontally
  	align-items: center; // Vertically center-align children

	img {
		width: 58px;
		height: 58px;
		border-radius: 58px;
	}
`;
