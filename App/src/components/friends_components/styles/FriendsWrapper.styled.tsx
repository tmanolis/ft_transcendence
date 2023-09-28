import styled from "styled-components";

export const FriendsWrapper = styled.div`
	width: 950px;
	height: 522px;
	overflow-y: auto; /* Enable vertical scrolling if content overflows vertically */
	overflow-x: hidden; /* Hide horizontal overflow */

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