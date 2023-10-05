import React, { useState } from "react";
import {
  SettingsModalStyled,
  ModalWrapper,
  Head,
  ContentContainer,
  Input,
  ConfirmButton,
} from "./styles/ConversationSettingsModal.styled";
import ButtonStyled from "../../settings_components/styles/ConfirmButton.styled";
import { Room } from "../../../pages/Chat";
import iconSrc from "/icon/Cross.svg";

interface SettingsModalProps {
  onClose: () => void; // Callback to close the menu
  chatRoom: Room;
  userName: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, userName, chatRoom }) => {
	const [newPassword, setNewPassword] = useState("");

  const handleButtonClick = () => {
    onClose();
  }

  return (
    <SettingsModalStyled>
      <ModalWrapper>
        <Head>
          <h1>&gt; Channel-Settings</h1>
          <img
            src={iconSrc}
            alt="cross_icon"
            onClick={handleButtonClick}
          />
        </Head>
        <ContentContainer>
          <div className="enable-section">
            <input type="checkbox" />
            <p className="infos">Enable Password</p>
          </div>
          <p className="description">
            A password will be needed in order<br/>to join this channel
          </p>
          <p className="updatePass">Update Password</p>
        </ContentContainer>
        <Input>
          <input
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="<type name here>"
            />
        <ConfirmButton>
          <ButtonStyled>Confirm</ButtonStyled>
        </ConfirmButton>
        </Input>
      </ModalWrapper>
    </SettingsModalStyled>
  );
};

export default SettingsModal;