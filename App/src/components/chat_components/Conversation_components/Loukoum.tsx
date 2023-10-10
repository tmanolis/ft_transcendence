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
  const [errorResponse, setErrorResponse] = useState("");

  const getMessagesList = async (room_name: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/channel/history?name=${room_name}`,
        { withCredentials: true }
      );
      console.log(response.data.channelHistory.messages);
      setMessagesList(response.data.channelHistory.messages);
      setErrorResponse("");
    } catch (error) {
      console.log("You have been banned from this channel error : ", error);
      setMessagesList([]);
      setErrorResponse("Too bad, you have been banned from this channel...");
    }
  };

  useEffect(() => {
    // Fetch initial data
    getMessagesList(chatRoom.name);
    
    // Listen for "ChannelUpdated" event
    socket_chat.on(`channelUpdated/${chatRoom.name}`, (payload: any) => {
      console.log(payload);
      // When the event is triggered, fetch the updated messages
      getMessagesList(payload.room);
    });

    // Clean up Socket.IO event listener when component is unmounted
    return () => {
      socket_chat.off(`channelUpdated/${chatRoom.name}`);
    };
  }, [chatRoom]); // Dependency array with chatRoom and socket_chat to re-run the effect when they change

  return (
    <MessagesListWrapper>
      {Item(messagesList)}
      {errorResponse && (
			<div style={{ color: "red", fontSize: "12px", padding: "5px" }}>{errorResponse}</div>)}
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



// REACT QUERY A TESTER
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



// VERSION QUI MARCHE MAIS MOCHE
// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { Room } from '../../../pages/Chat';
// import { Socket } from 'socket.io-client';
// import { MessageContainer, MessagesListWrapper } from './styles/Loukoum.styled';

// interface Message {
//   id: number;
//   text: string;
//   sendtime: string; // DateTime
//   sender: string;
//   roomID: string;
// }

// interface LoukoumProps {
//   chatRoom: Room;
//   socket_chat: Socket;
// }

// const Loukoum: React.FC<LoukoumProps> = ({ chatRoom, socket_chat }) => {
//   const [messagesList, setMessagesList] = useState<Message[]>([]);

//   const getMessagesList = async () => {

//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/channel/history?name=${chatRoom.name}`,
//         { withCredentials: true }
//       );
//       setMessagesList(response.data.channelHistory.messages);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     // Fetch initial data
//     getMessagesList();

//     // Polling interval in milliseconds (e.g., poll every 5 seconds)
//     const pollingInterval = 500;

//     // Start polling
//     const intervalId = setInterval(() => {
//       getMessagesList();
//     }, pollingInterval);

//     // Clean up interval when component is unmounted
//     return () => clearInterval(intervalId);
//   }, [chatRoom]); // Add an empty dependency array to run this effect only once

//   return (
//     <MessagesListWrapper>
//       {Item(messagesList)}
//     </MessagesListWrapper>
//   );
// }

// function Item(data: Message[]) {
//   return (
//     <>
//       {data.map((value, index) => (
//           <MessageContainer
//             key={index}
//             isCurrentUser={false} // Pass the prop based on the condition
//           >
//             {value.sender}: {value.text}
//           </MessageContainer>
//         ))}
//     </>
//   );
// }

// export default Loukoum;