import PageContainer from "../components/PageContainer";
import { ChatWrapper } from "../components/chat_components/styles/ChatWrapper.styled";
import Landing from "../pages/Landing";

const Chat = () => {
  return (
    <>
      <Landing />
      <PageContainer type="other">
		<ChatWrapper>
        <div className="chat_navigation">
			<div className="chat_list" />
			<div className="buttons">
				<button>New chat</button>
				<button>New Channel</button>
			</div>
		</div>
		<div className="messages_area" />
		</ChatWrapper>
      </PageContainer>
    </>
  )
};

export default Chat;