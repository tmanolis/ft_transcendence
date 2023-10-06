import React, { useState , useEffect} from "react";
import axios from "axios"
import {
  UsersListModalStyled,
  ModalWrapper,
  Head,
  UsersList,
} from "./styles/ConversationUsersListModal.styled";
import UserInfo from "./ConversationUserInfo"
import { Room } from "../../../pages/Chat";
import iconSrc from "/icon/Cross.svg";

interface UsersListModalProps {
  onClose: () => void; // Callback to close the menu
  chatRoom: Room;
  userName: string;
}

const UsersListModal: React.FC<UsersListModalProps> = ({ onClose, chatRoom }) => {

  const handleButtonClick = () => {
    onClose();
  }

  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace "%23" with "#"
        const formattedRoomName = encodeURIComponent(chatRoom.name.replace('%23', /#/g));
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/channel/members?name=${formattedRoomName}`,
          {
            withCredentials: true,
          }
        );
        setUsersList(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [chatRoom]);


  return (
    <UsersListModalStyled>
      <ModalWrapper>
        <Head>
          <h1>&gt; Channel-Users</h1>
          <img src={iconSrc} alt="cross_icon" onClick={handleButtonClick} />
        </Head>
        <UsersList>
          {usersList.map((user, index) => (
            <UserInfo key={index} user={user} />
          ))}
        </UsersList>
      </ModalWrapper>
    </UsersListModalStyled>
  );
};


export default UsersListModal;