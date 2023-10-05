import React from "react";
import { ChanMenuBar, ChanMenuElement, RedTextButton } from "./styles/ChannelMenu.styled";

interface ChannelMenuProps {
  onCloseMenu: () => void; // Callback to close the menu
}

const ChannelMenu: React.FC<ChannelMenuProps> = ({ onCloseMenu }) => {

  const handleButtonClick = () => {
    onCloseMenu(); // Call the callback to close the menu
  }
  
  return (
    <ChanMenuBar>
      <ChanMenuElement onClick={handleButtonClick}>Users</ChanMenuElement>
      <ChanMenuElement onClick={handleButtonClick}>Settings</ChanMenuElement>
      <RedTextButton onClick={handleButtonClick}>Leave Channel</RedTextButton>
    </ChanMenuBar>
  );
};

export default ChannelMenu;