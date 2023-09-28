import styled from 'styled-components';

export const FriendsListWrapper = styled.div`
	margin: 15px;
	padding: 15px;
	height: 477px;
	overflow: auto; // Add overflow to allow scrolling if content overflows
	font-family: "JetBrains Mono",monospace;

	/* Add scrollbar styles for WebKit browsers */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #555;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const FriendContainer = styled.div`
	width: 350px;
	height: 78px;
	margin: 20px;
	padding: 20px; /* Add padding to create space between the content and the border */

	border-top: 1px solid #FFF;
	border-left: 1px solid #FFF;
	background: #000;
	box-shadow: -1px -1px 0px 0px #5A5A5A inset;

	display: flex; // Align children horizontally
  	align-items: center; // Vertically center-align children
	gap: 15px; /* Add the gap property to control spacing between components */

	font-size: 18px;
	font-style: normal;
	font-weight: 500;
	letter-spacing: 0.36px;
`;

export const CodeBar = styled.img`
	width: 92px;
	height: 45px;
`;

export const Avatar = styled.img`
	width: 58px;
	height: 58px;
	border-radius: 58px;
`;

export const UserInfos = styled.div`
	width: 200px;

	display: flex;
	flex-direction: column;

	span {
		font-size: 14px;
	}
`;

export const Rank = styled.div`
	margin-right: 8px;
	font-size: 45px;
	font-style: normal;
	font-weight: 550; /* Set the font weight to make it bold */
`;