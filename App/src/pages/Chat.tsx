import { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import ChatNavigation from "../components/chat_components/ChatNavigation";
import { ChatWrapper } from "../components/chat_components/styles/ChatWrapper.styled";
import Landing from "../pages/Landing";
import ConversationWindow from "../components/chat_components/Conversation_components/ConversationWindow";
import { ConversationWindowWrapper } from "../components/chat_components/Conversation_components/styles/ConversationWindow.styled";
import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";

export interface Room {
	name: string,
  status: string,
  role?: string,
}

const Chat = () => {
  // ouverture de socket
  const access_token: string = Cookies.get("jwt")!;
  const socket_chat: Socket = io(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
  extraHeaders: {
    Authorization: access_token,
    },
  });

  const [chatRoom, setChatRoom] = useState<Room | null>(null);
  const [chatRoomName, setChatRoomName] = useState<string | null>(null);

  const openChat = (room: Room, roomName: string | null) => {
    console.log("JE SUIS DANS OPENCHAT");
    setChatRoom(room);
    setChatRoomName(roomName);
  }

	useEffect(() => {
    socket_chat.connect();
    // socket_chat?.emit("updateHistory");
    return () => {
      socket_chat.disconnect();
    }
  }, [])


  return (
    <>
      <Landing />
      <PageContainer type="other">
        <ChatWrapper>
          <ChatNavigation openChat={openChat} socket_chat={socket_chat}/>
          <ConversationWindowWrapper>
            {chatRoom && <ConversationWindow chatRoom={chatRoom} roomName={chatRoomName} socket_chat={socket_chat}/>}
          </ConversationWindowWrapper>
        </ChatWrapper >
      </PageContainer>
    </>
  )
};

export default Chat;