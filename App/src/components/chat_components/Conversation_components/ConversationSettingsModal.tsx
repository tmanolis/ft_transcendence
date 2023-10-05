import react, { useState, useEffect } from "react";
import axios from "axios";
import { SettingsModalStyled, ChanMenuElement, RedTextButton } from "./styles/ConversationMenu.styled";
import { Room } from "../../../pages/Chat";

interface SettingsModalProps {
  onCloseMenu: () => void; // Callback to close the menu
	chatRoom: Room;
  userName: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onCloseMenu, chatRoom, userName }) => {

  const handleButtonClick = () => {
    onCloseMenu();
  }

  return (
    <SettingsModalStyled>
        <h1>{`> Settings`}</h1>
    </SettingsModalStyled>
  );
};

export default SettingsModal;