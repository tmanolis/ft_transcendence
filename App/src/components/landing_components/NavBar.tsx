import React from "react";
import { Link } from "react-router-dom";
import NavBarStyled from "./styles/NavBar.styled";

type NavButtonProps = {
  to: string;
  iconSrc: string;
  alt: string;
};

const NavButton: React.FC<NavButtonProps> = ({ to, iconSrc, alt }) => {
  return (
    <Link to={to}>
      <img src={iconSrc} alt={alt} />
    </Link>
  );
};

const NavBar: React.FC = () => {
  return (
    <NavBarStyled>
      <NavButton to="/" iconSrc="../../public/icon/Home.svg" alt="Home" />
      <NavButton to="/play" iconSrc="../../public/icon/Play.svg" alt="Play" />
      <NavButton
        to="/chat"
        iconSrc="../../public/icon/Friends.svg"
        alt="Chat"
      />
      <NavButton
        to="/leaderboard"
        iconSrc="../../public/icon/Leaderboard.svg"
        alt="Leaderboard"
      />
      <NavButton to="/auth" iconSrc="../../public/icon/Exit.svg" alt="Exit" />
    </NavBarStyled>
  );
};

export default NavBar;
