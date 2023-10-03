import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Avatar, ChatContainer, ChatListWrapper, Username } from './styles/ChatList.styled';

interface Chat {
	name: string,
  status: string, 
  owner: string
}

interface ChatListProps {
  openChat: (newChatName: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ openChat }) => {
  const [ChatList, setChatList] = useState<Chat[]>([]);

  const getChatList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/chat/rooms`, // using friends list to test front: /chat/rooms
        { withCredentials: true }
      );
      console.log(response);
      setChatList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChatList();
  }, []); // Add an empty dependency array to run this effect only once

  return (
    <ChatListWrapper>
        {Item(ChatList, openChat)}
    </ChatListWrapper>
  );
}

export default ChatList;

function Item(data: Chat[], openChat: (newChatName: string) => void) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const openConversation = (username: string) => {
    console.log(username + ": j'ai click pour ouvrir une conv");
    setSelectedChat(username);
    openChat(username);
  }

  return (
    <>
      {data.map((value, index) => (
        <ChatContainer 
        key={index} 
        onClick={() => openConversation(value.name)}
        selected={selectedChat === value.name}
        >
          <div className="avatar">
            <Avatar src="../../../public/img/Web_img.jpg" alt="user_avatar" />
          </div>
          <Username>{value.name}</Username>
        </ChatContainer>
      ))}
    </>
  );
}
