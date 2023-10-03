import { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import ChatNavigation from "../components/chat_components/ChatNavigation";
import { ChatWrapper } from "../components/chat_components/styles/ChatWrapper.styled";
import Landing from "../pages/Landing";
import ConversationWindow from "../components/chat_components/Conversation_component/ConversationWindow";
import { ConversationWindowWrapper } from "../components/chat_components/Conversation_component/styles/ConversationWindow.styled";
import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";

// ouverture de socket
const access_token: string = Cookies.get("jwt")!;
const socket: Socket = io(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
extraHeaders: {
	Authorization: access_token,
	},
});

const Chat = () => {
  const [chatName, setChatName] = useState("");

  const openChat = (newChatName: string) => {
    setChatName(newChatName);
  }

	useEffect(() => {
    socket.connect();
    // socket?.emit("updateHistory");
    return () => {
      socket.disconnect();
    }
  }, [])


  return (
    <>
      <Landing />
      <PageContainer type="other">
      <ChatWrapper>
        <ChatNavigation openChat={openChat} socket={socket}/>
        <ConversationWindowWrapper>
          {chatName && <ConversationWindow chatName={chatName} />}
        </ConversationWindowWrapper>
      </ChatWrapper >
      </PageContainer>
    </>
  )
};

export default Chat;