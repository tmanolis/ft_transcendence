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
      <NavButton to="/" iconSrc="../../public/icon/Home.svg" alt="Home" />
      <NavButton to="/play" iconSrc="../../public/icon/Play.svg" alt="Play" />
      <NavButton to="/chat" iconSrc="../../public/icon/Friends.svg" alt="Chat" />
      <NavButton to="/leaderboard" iconSrc="../../public/icon/Leaderboard.svg" alt="Leaderboard" />
      <NavButton to="/auth" iconSrc="../../public/icon/Exit.svg" alt="Exit" />
    </NavBar>
  );
};

export default MenuBar;
