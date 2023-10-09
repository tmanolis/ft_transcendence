// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { Avatar, ChatContainer, ChatListWrapper, Username } from './styles/UserChatList.styled';
// import { Room } from '../../pages/Chat';

// interface UserChatListProps {
//   openChat: (room: Room) => void;
// }

// const UserChatList: React.FC<UserChatListProps> = ({ openChat }) => {
//   const [ChatList, setChatList] = useState<Room[]>([]);

//   const getChatList = async () => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/user/myRooms`, // using friends list to test front: /chat/rooms
//         { withCredentials: true }
//       );
//       console.log(response);
//       setChatList(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getChatList();
//   }, []); // Add an empty dependency array to run this effect only once

//   return (
//     <ChatListWrapper>
//         {Item(ChatList, openChat)}
//     </ChatListWrapper>
//   );
// }

// export default UserChatList;

// function Item(data: Room[], openChat: (room: Room) => void) {
//   const [selectedChat, setSelectedChat] = useState<string | null>(null);

//   const openConversation = (room: Room) => {

//     setSelectedChat(room.name);
//     openChat(room);
//   }

//   return (
//     <>
//       {data.map((value, index) => (
//         <ChatContainer 
//         key={index} 
//         onClick={() => openConversation(value)}
//         selected={selectedChat === value.name}
//         >
//           <div className="avatar">
//             <Avatar src="/src/assets/img/Web_img.jpg" alt="room_avatar" />
//           </div>
//           <Username>{value.name}</Username>
//           {value.status === 'PRIVATE' && <img src="/src/assets/icon/Lock.svg" alt="lock_icon" />}
//         </ChatContainer>
//       ))}
//     </>
//   );
// }

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Avatar, ChatContainer, Username } from './styles/UserChatList.styled';
import { Room } from '../../pages/Chat';

interface ItemProps {
  room: Room;
  openChat: (room: Room, roomName: string | null) => void;
}

function Item({ room, openChat }: ItemProps) {
  const [directMessageName, setDirectMessageName] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      if (room.status === 'DIRECT') {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/channel/otherUser?name=${room.name}`, // Update this endpoint accordingly
            { withCredentials: true }
          );
          setDirectMessageName(response.data.userName);
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Handle errors if needed
        }
      }
    };

    fetchUserName(); // Call the function when the component mounts
  }, [room]); // Run the effect whenever `room` prop changes

  const openConversation = () => {
    let roomName: string | null = room.name;

    if (room.status === 'DIRECT')
      roomName = directMessageName;

    openChat(room, roomName);
    setSelectedChat(room.name);
  };

  return (
    <ChatContainer
      onClick={openConversation}
      selected={selectedChat === room.name}
    >
      <div className="avatar">
        <Avatar src="/src/assets/img/Web_img.jpg" alt="room_avatar" />
      </div>
      <Username>{directMessageName || room.name}</Username>
      {room.status === 'PRIVATE' && <img src="/src/assets/icon/Lock.svg" alt="lock_icon" />}
    </ChatContainer>
  );
}

interface UserChatListProps {
  openChat: (room: Room, roomName: string | null) => void;
}

const UserChatList: React.FC<UserChatListProps> = ({ openChat }) => {
  const [chatList, setChatList] = useState<Room[]>([]);

  useEffect(() => {
    const getChatList = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/myRooms`,
          { withCredentials: true }
        );
        setChatList(response.data);
      } catch (error) {
        console.error('Error fetching chat list:', error);
        // Handle errors if needed
      }
    };

    getChatList();
  }, []); // Run this effect only once when the component mounts

  return (
    <div>
      {chatList.map((room, index) => (
        <Item key={index} room={room} openChat={openChat} />
      ))}
    </div>
  );
};

export default UserChatList;
