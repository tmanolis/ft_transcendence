import PageContainer from "../components/PageContainer";
import ChatNavigation from "../components/chat_components/ChatNavigation";
import { ChatWrapper } from "../components/chat_components/styles/ChatWrapper.styled";
import Landing from "../pages/Landing";

const Chat = () => {
  return (
    <>
      <Landing />
      <PageContainer type="other">
		<ChatWrapper>
			<ChatNavigation />
		<div className="messages_area" />
		</ChatWrapper>
      </PageContainer>
    </>
  )
};

export default Chat;