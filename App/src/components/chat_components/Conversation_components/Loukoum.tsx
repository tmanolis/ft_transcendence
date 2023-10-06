import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ChatContainer, ChatListWrapper, Username } from './styles/Loukoum.styled';
import { Room } from '../../../pages/Chat';
interface Message {
  id: number,
  text: string,
  sendtime: string, // DateTime
  sender: string,
  roomID: string
}

interface LoukoumProps {
	chatRoom: Room;
  }

  const Loukoum: React.FC<LoukoumProps> = ({ chatRoom }) => {
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
  
      // Polling interval in milliseconds (e.g., poll every 5 seconds)
      const pollingInterval = 850;
  
      // Start polling
      const intervalId = setInterval(() => {
        getMessagesList();
      }, pollingInterval);
  
      // Clean up interval when component is unmounted
      return () => clearInterval(intervalId);
    }, [chatRoom]); // Add an empty dependency array to run this effect only once
  
    return (
      <ChatListWrapper>
        {Item(messagesList)}
      </ChatListWrapper>
    );
  }

export default Loukoum;

function Item(data: Message[]) {

  return (
    <>
      {data.map((value, index) => (
        <ChatContainer
        key={index} 
        >
        <Username>{value.sender}: {value.text}</Username>
        </ChatContainer>
      ))}
    </>
  );
}

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

