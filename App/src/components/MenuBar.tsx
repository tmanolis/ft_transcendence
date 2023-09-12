import React from "react";
import { Link } from "react-router-dom";
import NavBar from "./styles/NavBar.styled";

type NavButtonProps = {
    to: string;
    iconSrc: string;
    alt: string;
  };

const NavButton: React.FC<NavButtonProps> = ({ to, iconSrc, alt }) => {
return (
    <Link to={to}>
    <div>
        <img src={iconSrc} alt={alt} />
    </div>
    </Link>
);
};

const MenuBar: React.FC = () => {
  return (
    <NavBar>
      <NavButton to="/" iconSrc="../assets/icon/Home.svg" alt="Home" />
      <NavButton to="/play" iconSrc="../assets/icon/Play.svg" alt="Play" />
      <NavButton to="/chat" iconSrc="../assets/icon/Friends.svg" alt="Chat" />
      <NavButton to="/leaderboard" iconSrc="../assets/icon/Leaderboard.svg" alt="Leaderboard" />
      <NavButton to="/auth" iconSrc="../assets/icon/Exit.svg" alt="Exit" />
    </NavBar>
  );
};

export default MenuBar;
