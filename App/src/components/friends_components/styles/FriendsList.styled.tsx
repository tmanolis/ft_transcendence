import styled from 'styled-components';

export const FriendsListWrapper = styled.div`
	margin: 15px;
	padding: 15px;
	height: 445px;
	width: 900px;
	overflow-y: auto; /* Enable vertical scrolling if content overflows vertically */
	font-family: "JetBrains Mono", monospace;

	display: flex;
	flex-wrap: wrap; /* Allow children to wrap to the next line when they don't fit */
	justify-content: space-between;

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
	flex-direction: row;
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

export const ProfileButton = styled.button`
	padding: 5px;
	margin-right: 6px;

	border-top: 1px solid #fff;
  	border-left: 1px solid #fff;
	background: #000;
	box-shadow: 2px 2px 0px 0px rgba(157, 157, 157, 0.25);

	color: #fff;
	font-family: "JetBrains Mono", monospace;
	font-style: normal;
	font-weight: 400;
	letter-spacing: 0.2px;
`;