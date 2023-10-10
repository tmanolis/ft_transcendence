import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Avatar, ChatContainer, ChatListWrapper, Username } from './styles/ListsContainers.styled';

interface Channel {
    name: string,
    status: string,
    createdAt: string
}

interface AllChannelsListProps {
  getChannel: (name: string) => void;
}

const AllChannelsList: React.FC<AllChannelsListProps> = ({ getChannel }) => {
  const [allChannelList, setAllChannelList] = useState<Channel[]>([]);

  const getAllChannelList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/channel/allChannels`, // using friends list to test front: /chat/Channels
        { withCredentials: true }
      );
      setAllChannelList(response.data.allRooms);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllChannelList();
  }, []); // Add an empty dependency array to run this effect only once

  return (
    <ChatListWrapper>
        {Item(allChannelList, getChannel)}
    </ChatListWrapper>
  );
}

export default AllChannelsList;

function Item(data: Channel[], getChannel: (name: string) => void) {
	const [selectedChat, setSelectedChat] = useState<string | null>(null);

	const selectChannel = (channel: Channel) => {
    setSelectedChat(channel.name);
    getChannel(channel.name);
	}

  return (
    <>
      {data && data.map((value, index) => (
        <ChatContainer 
        key={index} 
        onClick={() => selectChannel(value)}
		    selected={selectedChat === value.name}
        >
          <div className="avatar">
            <Avatar src="../../../public/img/Web_img.jpg" alt="room_avatar" />
          </div>
          <Username>{value.name}</Username>
          {value.status === 'PRIVATE' && <img src="../../../../public/icon/Lock.svg" alt="lock_icon" />}
        </ChatContainer>
      ))}
    </>
  );
}
