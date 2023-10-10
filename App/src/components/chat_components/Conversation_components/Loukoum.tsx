import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Room } from '../../../pages/Chat';
import { Socket } from 'socket.io-client';
import { MessageContainer, MessagesListWrapper } from './styles/Loukoum.styled';

interface Message {
  id: number;
  text: string;
  sendtime: string; // DateTime
  sender: string;
  roomID: string;
}

interface LoukoumProps {
  chatRoom: Room;
  socket_chat: Socket;
}

const Loukoum: React.FC<LoukoumProps> = ({ chatRoom, socket_chat }) => {
  const [messagesList, setMessagesList] = useState<Message[]>([]);

  const getMessagesList = async () => {

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/channel/history?name=${chatRoom.name}`,
        { withCredentials: true }
      );
      console.log(response.data.channelHistory.messages);
      setMessagesList(response.data.channelHistory.messages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Fetch initial data
    getMessagesList();
    
    // Listen for "ChannelUpdated" event
    socket_chat.on('channelUpdated', () => {
      // When the event is triggered, fetch the updated messages
      getMessagesList();
    });

    // Clean up Socket.IO event listener when component is unmounted
    return () => {
      socket_chat.off('ChannelUpdated');
    };
  }, [chatRoom, socket_chat]); // Dependency array with chatRoom and socket_chat to re-run the effect when they change

  return (
    <MessagesListWrapper>
      {Item(messagesList)}
    </MessagesListWrapper>
  );
}

function Item(data: Message[]) {
    const [userName, setUserName] = useState("");
  
    useEffect(() => {
      const getUser = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/user/me`,
            { withCredentials: true }
          );
          setUserName(response.data.userName);
        } catch (error) {
          console.log(error);
        }
      };
  
      getUser();
    }, []); // Empty dependency array ensures that effect runs only once after initial render
  
    return (
      <>
        {data.map((value, index) => (
          <MessageContainer
            key={index}
            isCurrentUser={value.sender === userName} // Pass the prop based on the condition
          >
            {value.sender}: {value.text}
          </MessageContainer>
        ))}
      </>
    );
}

export default Loukoum;


// import React from 'react';
// import { useQuery } from 'react-query';
// import { ChatContainer, ChatListWrapper, Username } from './styles/Loukoum.styled';
// import { Room } from '../../../pages/Chat';
// import axios from 'axios';

// interface Message {
//   id: number;
//   text: string;
//   sendtime: string; // DateTime
//   sender: string;
//   roomID: string;
// }

// interface LoukoumProps {
//   chatRoom: Room;
// }

// const Loukoum: React.FC<LoukoumProps> = ({ chatRoom }) => {
//   const { data: messagesList, isLoading, isError, refetch } = useQuery('messages', getMessagesList);

//   async function getMessagesList() {
//     const nameRefacto = chatRoom.name.replace(/#/g, '%23');
//     const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/channel/history?name=${nameRefacto}`, {
//       withCredentials: true,
//     });
//     return response.data.messages;
//   }

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (isError) {
//     return <div>Error fetching data</div>;
//   }

//   return (
//     <ChatListWrapper>
//       {Item(messagesList)}
//     </ChatListWrapper>
//   );
// }

// function Item(data: Message[]) {
//   return (
//     <>
//       {data.map((value, index) => (
//         <ChatContainer key={index}>
//           <Username>
//             {value.sender}: {value.text}
//           </Username>
//         </ChatContainer>
//       ))}
//     </>
//   );
// }

// export default Loukoum;

