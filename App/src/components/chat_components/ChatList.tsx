import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Avatar, ChatContainer, ChatListWrapper, Username } from './styles/ChatList.styled';

interface Chat {
	avatar: string;
	gamesLost: number;
	gamesWon: number;
	status: string;
	userName: string;
}

interface ChatListProps {
  openChat: (newChatName: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ openChat }) => {
  const [ChatList, setChatList] = useState<Chat[]>([]);

  const getChatList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/friend/friendList`, // using friends list to test front
        { withCredentials: true }
      );
      console.log(response);
      setChatList(response.data.friendList);
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
        onClick={() => openConversation(value.userName)}
        selected={selectedChat === value.userName}
        >
          <div className="avatar">
            <Avatar src={`data:image/png;base64,${value.avatar}`} alt="user_avatar" />
          </div>
          <Username>{value.userName}</Username>
        </ChatContainer>
      ))}
    </>
  );
}
