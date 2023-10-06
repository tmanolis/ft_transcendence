import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ChatContainer, ChatListWrapper, Username } from './styles/Loukoum.styled';
import { Room } from '../../../pages/Chat';
import { Socket } from 'socket.io-client';

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
    const nameRefacto = chatRoom.name.replace(/#/g, '%23');

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/channel/history?name=${nameRefacto}`,
        { withCredentials: true }
      );
      setMessagesList(response.data.messages);
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
    <ChatListWrapper>
      {Item(messagesList)}
    </ChatListWrapper>
  );
}

function Item(data: Message[]) {
  return (
    <>
      {data.map((value, index) => (
        <ChatContainer key={index}>
          <Username>
            {value.sender}: {value.text}
          </Username>
        </ChatContainer>
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

