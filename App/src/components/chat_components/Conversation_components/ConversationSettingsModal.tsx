import React, { useState } from "react";
import {
  SettingsModalStyled,
  ModalWrapper,
  Head,
  ContentContainer,
  Input,
  ConfirmButton,
  PrivateInfo,
} from "./styles/ConversationSettingsModal.styled";
import ButtonStyled from "../../settings_components/styles/ConfirmButton.styled";
import { Room } from "../../../pages/Chat";
import iconSrc from "/icon/Cross.svg";

interface SettingsModalProps {
  onClose: () => void; // Callback to close the menu
  chatRoom: Room;
  userName: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, chatRoom }) => {
  const [newPassword, setNewPassword] = useState("");
  const [isPrivate, setIsPrivate] = useState(chatRoom.status === "PRIVATE");

  const handleButtonClick = () => {
    onClose();
  }

  const handleCheckboxChange = () => {
    setIsPrivate(!isPrivate);
    const newStatus = isPrivate ? "PUBLIC" : "PRIVATE";

    console.log("New Status:", newStatus);
  };

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
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={handleCheckboxChange}
            />
            <p className="infos">Enable Password</p>
          </div>
          <p className="description">
            A password will be needed in order<br />to join this channel
          </p>
          {isPrivate ? (
            <PrivateInfo>
              <p className="updatePass">Update Password</p>
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
            </PrivateInfo>
          ) : null}
        </ContentContainer>
      </ModalWrapper>
    </SettingsModalStyled>
  );
};

export default SettingsModal;