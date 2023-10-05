import React from "react";
import {
  SettingsModalStyled,
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
    <SettingsModalStyled>
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
    </SettingsModalStyled>
  );
};

export default UsersListModal;