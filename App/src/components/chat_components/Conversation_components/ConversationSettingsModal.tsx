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
import axios from "axios";

interface SettingsModalProps {
  onClose: () => void; // Callback to close the menu
  chatRoom: Room;
  userName: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, chatRoom }) => {
  const [newPassword, setNewPassword] = useState("");
  const [isPrivate, setIsPrivate] = useState(chatRoom.status === "PRIVATE");

  const isConfirmButtonDisabled = newPassword.trim() === "";

  const handleButtonClick = () => {
    onClose();
    window.location.reload();
  }

  const toggleChannelPrivacy = async () => {
    setIsPrivate(!isPrivate);
    const newStatus = isPrivate ? "PUBLIC" : "PRIVATE";

    console.log("New Status:", newStatus);

    if (newStatus === "PUBLIC") {
      // If the channel is set to public, send a request to change it to public
      try {
        const response = await changeChanneltoPublic();
        console.log(response?.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const changeChanneltoPublic = async () => {
    const updateDTO = {
      channel: chatRoom.name,
    };
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/channel/toPublic`,
        updateDTO,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmButtonClick = async () => {
    if (isPrivate && !isConfirmButtonDisabled) {
      try {
        const response = await changeChanneltoPrivate();
        console.log(response?.data);
      } catch (error) {
        console.log(error);
      }
    
      onClose();
      window.location.reload();
    }
  };

  const changeChanneltoPrivate = async () => {
    const updateDTO = {
      channel: chatRoom.name,
      password: newPassword,
    };

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/channel/toPrivate`,
        updateDTO,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
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
              onChange={toggleChannelPrivacy}
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
                  <ButtonStyled
                    onClick={handleConfirmButtonClick}
                    disabled={isConfirmButtonDisabled}
                  >
                    Confirm
                  </ButtonStyled>
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