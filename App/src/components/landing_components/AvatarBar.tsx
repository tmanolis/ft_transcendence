import React from "react";
import { Link } from "react-router-dom";
import AvatarBarStyled from "./styles/AvatarBar.styled";

type AvatarMenuProps = {
    to: string;
    buttonName: string;
};

const AvatarNavButton: React.FC<AvatarMenuProps> = ({ to, buttonName }) => {
    return (
        <Link to={to}>
            <div>
              <button>{buttonName}</button>
            </div>
        </Link>
    );
};

const AvatarBar: React.FC = () => {
  return (
    <AvatarBarStyled>
      <AvatarNavButton to="/profile" buttonName="Profile"/>
      <AvatarNavButton to="/settings" buttonName="Settings"/>
      <AvatarNavButton to="/auth" buttonName="Logout"/>
    </AvatarBarStyled>
  );
};

export default AvatarBar;
