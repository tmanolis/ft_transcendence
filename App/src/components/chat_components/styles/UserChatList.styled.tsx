import styled from 'styled-components';
  

export const ChatListWrapper = styled.div`
	height: 549px;
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
  
  @media screen and (max-width: 1480px) {
		height: 30%;
		display: flex;
		flex-direction: row;
	}
`;

interface StyledChatContainerProps {
	selected?: boolean;
  }
  
export const StyledChatContainer = styled.div<StyledChatContainerProps>`
	margin: 5px;
	padding: 10px; /* Add padding to create space between the content and the border */

	/* border-top: 1px solid #FFF;
	border-left: 1px solid #FFF;
	background: #000;
	box-shadow: -1px -1px 0px 0px #5A5A5A inset; */

	display: flex; // Align children horizontally
  	align-items: center; // Vertically center-align children
	gap: 15px; /* Add the gap property to control spacing between components */

	font-size: 18px;
	font-style: normal;
	font-weight: 500;
	letter-spacing: 0.36px;

	border: ${(props) => (props.selected ? '2px solid #FFFFFF' : 'none')};
  	background: ${(props) =>
    props.selected ? 'rgba(255, 255, 255, 0.50)' : 'transparent'};

	img {
		margin-left: auto;
	}

	@media screen and (max-width: 1480px) {
		width: fit-content;
		height: 20%;
		width: auto;
		font-size: 15px;
	}
`;

interface ChatContainerProps {
	onClick?: () => void;
	selected?: boolean;
	children?: React.ReactNode;
 }

export const ChatContainer: React.FC<ChatContainerProps> = ({ onClick, selected, children }) => {
	return (
	  <StyledChatContainer selected={selected} onClick={onClick}>
		{children}
	  </StyledChatContainer>
	);
  };

export const Avatar = styled.img`
	width: 45px;
	height: 45px;
	border-radius: 45px;
`;

export const Username = styled.div`
	width: 150px;	
	
	@media screen and (max-width: 1480px) {
		height: 20%;
		width: auto;
		font-size: 15px;
  }
`;