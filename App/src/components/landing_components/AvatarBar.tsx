import React from "react";
import { Link } from "react-router-dom";
import AvatarBarStyled from "./styles/AvatarBar.styled";
import { GameSocket } from "../GameSocket";
import axios from "axios";
type AvatarMenuProps = {
  to: string;
  buttonName: string;
  onClick?: () => void; // Add optional onClick prop
};

type AvatarBarProps = {
  userName?: string;
};

const AvatarNavButton: React.FC<AvatarMenuProps> = ({
  to,
  buttonName,
  onClick,
}) => {
  return (
    <Link to={to}>
      <h1 onClick={onClick}>{buttonName}</h1>
    </Link>
  );
};

const AvatarBar: React.FC<AvatarBarProps> = ({ userName }) => {
  const handleLogout = async () => {
    console.log("Logout button clicked");
    GameSocket.disconnect();

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.status);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AvatarBarStyled>
      <AvatarNavButton to={`/profile/${userName}`} buttonName="./Profile" />
      <AvatarNavButton to="/settings" buttonName="./Settings" />
      <AvatarNavButton
        to="/auth"
        buttonName="./Logout"
        onClick={handleLogout}
      />
    </AvatarBarStyled>
  );
};

export default AvatarBar;
