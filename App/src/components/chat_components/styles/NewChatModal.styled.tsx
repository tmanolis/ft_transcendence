import styled from "styled-components";

export const ModalContainer = styled.div` // blur behind popup
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1.5px); 
`;

export const PopUpWrapper = styled.div`
  display: flex;
  flex-direction: column; /* Stack children vertically */
  
  width: 898px;
  height: 580px;

  padding: 10px;

  border: 1px solid #FFF;
  background: #000;

  h2 {
    margin: 10px;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px; /* 80% */
    letter-spacing: 0.5px; 
  }

  .header {
    display: flex;
	  justify-content: space-between;
    align-items: center;

    padding: 10px;

    img {
      width: 35px;
      height: 35px;
    }
  }

  .lists_container {
    display: flex;
    justify-content: space-around;
  }

  .channel_container {
    width: 400px;

    margin: 15px;
    border: 1px solid #FFF;
  }

  .channel_container p {
    margin-left: 15px;
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    
}


  .buttons_container {
    display: flex;
    justify-content: space-between;
    margin: 15px;
  }

`;

export const ChatListWrapper = styled.div`
	height: 380px;
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
`;