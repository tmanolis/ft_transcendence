import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Avatar, ChatContainer, ChatListWrapper, Username } from './styles/ListsContainers.styled';

interface User {
	userName: string,
    avatar: string,
    status: string,
    gamesWon: string,
    gamesLost: string,
    achievements: []
}

interface AllUsersListProps {
  getUser: (name: string) => void;
}

const AllUsersList: React.FC<AllUsersListProps> = ({ getUser }) => {
  const [allUsersList, setAllUsersList] = useState<User[]>([]);

  const getAllUsersList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/all-users`, // using friends list to test front: /chat/Channels
        { withCredentials: true }
      );
      console.log(response);
      setAllUsersList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsersList();
  }, []); // Add an empty dependency array to run this effect only once

  return (
    <ChatListWrapper>
        {Item(allUsersList, getUser)}
    </ChatListWrapper>
  );
}

export default AllUsersList;

function Item(data: User[], getUser: (name: string) => void) {
	const [selectedChat, setSelectedChat] = useState<string | null>(null);

	const selectChannel = (user: User) => {
    
    setSelectedChat(user.userName);
    getUser(user.userName);
	}

  return (
    <>
      {data.map((value, index) => (
        <ChatContainer 
        key={index} 
        onClick={() => selectChannel(value)}
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
