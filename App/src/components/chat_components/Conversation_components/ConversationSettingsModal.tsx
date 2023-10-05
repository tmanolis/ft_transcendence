import React from "react";
import {
  SettingsModalStyled,
  ModalWrapper,
  ContentContainer,
  Description,
} from "./styles/ConversationSettingsModal.styled";
import { Room } from "../../../pages/Chat";
import iconSrc from "/icon/Cross.svg";

interface SettingsModalProps {
  onClose: () => void; // Callback to close the menu
  chatRoom: Room;
  userName: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, userName, chatRoom }) => {

  const handleButtonClick = () => {
    onClose();
  }

  return (
    <SettingsModalStyled>
      <ModalWrapper>
        <div className="header">
          <h1>&gt; Channel-Settings</h1>
          <img
            src={iconSrc}
            alt="cross_icon"
            onClick={handleButtonClick}
          />
        </div>
        <ContentContainer>
          <div className="enable-section">
            <input type="checkbox" />
            <Description>Enable Password</Description>
          </div>
          <p className="description">
            A password will be needed in order<br/>to join this channel
          </p>
        </ContentContainer>
      </ModalWrapper>
    </SettingsModalStyled>
  );
};

export default SettingsModal;