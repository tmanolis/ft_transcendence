import React from "react";
import {
  UsersListModalStyled,
  ModalWrapper,
  Head,
} from "./styles/ConversationUsersListModal.styled";
import { Room } from "../../../pages/Chat";
import iconSrc from "/icon/Cross.svg";

interface UsersListModalProps {
  onClose: () => void; // Callback to close the menu
  chatRoom: Room;
  userName: string;
}

const UsersListModal: React.FC<UsersListModalProps> = ({ onClose }) => {

  const handleButtonClick = () => {
    onClose();
  }

  return (
    <UsersListModalStyled>
      <ModalWrapper>
        <Head>
          <h1>&gt; Channel-Users</h1>
          <img
            src={iconSrc}
            alt="cross_icon"
            onClick={handleButtonClick}
          />
        </Head>
      </ModalWrapper>
    </UsersListModalStyled>
  );
};

export default UsersListModal;