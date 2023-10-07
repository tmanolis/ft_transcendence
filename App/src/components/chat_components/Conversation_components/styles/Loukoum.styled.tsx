import styled from "styled-components";

export const MessagesListWrapper = styled.div`
	height: 485px;
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

interface StyledMessageContainerProps {
	$isCurrentUser: boolean;
	children?: React.ReactNode;
  }
  
export const StyledMessageContainer = styled.div<StyledMessageContainerProps>`
	margin: 5px;
	padding: 5px; /* Add padding to create space between the content and the border */

	font-size: 14px;
	font-style: normal;
	font-weight: 500;
	letter-spacing: 0.36px;

	color: ${(props) => (props.$isCurrentUser ? '#71e679' : '#FFF')};

`;

interface MessageContainerProps {
	key?: number;
	isCurrentUser: boolean;
	children?: React.ReactNode;
 }

export const MessageContainer: React.FC<MessageContainerProps> = ({ isCurrentUser, children }) => {
	return (
	  <StyledMessageContainer $isCurrentUser={isCurrentUser} >
		{children}
	  </StyledMessageContainer>
	);
  };

export const Username = styled.div`
	font-size: 14px;
`;