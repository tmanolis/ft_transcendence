import { useState } from "react";
import PageContainer from "../components/PageContainer";
import ChatNavigation from "../components/chat_components/ChatNavigation";
import { ChatWrapper } from "../components/chat_components/styles/ChatWrapper.styled";
import Landing from "../pages/Landing";
import ConversationWindow from "../components/chat_components/Conversation_component/ConversationWindow";
import { ConversationWindowWrapper } from "../components/chat_components/Conversation_component/styles/ConversationWindow.styled";

const Chat = () => {
  const [chatName, setChatName] = useState("");

  const openChat = (newChatName: string) => {
    setChatName(newChatName);
  }

  return (
    <>
      <Landing />
      <PageContainer type="other">
      <ChatWrapper>
        <ChatNavigation openChat={openChat}/>
        <ConversationWindowWrapper>
          {chatName && <ConversationWindow chatName={chatName} />}
        </ConversationWindowWrapper>
      </ChatWrapper >
      </PageContainer>
    </>
  )
};

export default Chat;