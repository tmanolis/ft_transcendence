import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import axios from "axios";
import AvatarButton from "../components/landing_components/AvatarButton";
import LandingButton from "../components/landing_components/LandingButton";
import NavBar from "../components/landing_components/NavBar";
import AvatarBar from "../components/landing_components/AvatarBar";
import LandingContainer from "../components/landing_components/styles/LandingContainer.styled";
import { GameSocket } from "../components/GameSocket";
import { ChallengePopUp } from "../components/landing_components/ChallengePopUp";
import { createPortal } from "react-dom";

const Landing: React.FC = () => {
  const [menuBarIsShown, setMenuBarIsShown] = useState(false);
  const [avatarBarIsShown, setAvatarBarIsShown] = useState(false);
  const [challengePopUpOpen, setChallengePopUpOpen] = useState(false);
  const [invitedBy, setInvitedBy] = useState("");
  const [avatarPath, setAvatarPath] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/me`,
          {
            withCredentials: true,
          }
        );
        setAvatarPath(response.data.avatar);
        setUserName(response.data.userName);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();

  }, []);

  useEffect(() => {
    GameSocket.connect();

    GameSocket.on("gameInvite", (message) => {
      setInvitedBy(message.invitedBy);
      setChallengePopUpOpen(true);
      console.log(message.invitedBy);
      // GameSocket.emit('acceptInvitation', message.invitedBy);
    });
    // GameSocket.on('gameReady', () => {
    //   if (location.pathname !== "/pong")
    //     navigate("/pong");
    // });
    // GameSocket.on('retroGameReady', () => {
    //   navigate("/retropong");
    // });
    return () => {
      GameSocket.off("gameInvite");
      // GameSocket.off('gameReady');
      // GameSocket.off('retroGameReady');
    }
  }, [GameSocket]) // pas sure de cet ajout de dependence

  const handleLandingClick = () => {
    setMenuBarIsShown((current) => !current);
    if (avatarBarIsShown) setAvatarBarIsShown((current) => !current);
  };

  const handleAvatarClick = () => {
    setAvatarBarIsShown((current) => !current);
    if (menuBarIsShown) setMenuBarIsShown((current) => !current);
  };

  const handleCancelClick = () => {
		setChallengePopUpOpen(false);
	  };

  const userImageSrc = `data:image/png;base64,${avatarPath}`;

  return (
    <>
      <LandingContainer>
        <LandingButton onClick={handleLandingClick} navBar={menuBarIsShown} />
        <AvatarButton
          userImageSrc={userImageSrc}
          onClick={handleAvatarClick}
          avaBar={avatarBarIsShown}
        />
      </LandingContainer>
      {menuBarIsShown && <NavBar />}
      {avatarBarIsShown && <AvatarBar userName={userName} />}
      {challengePopUpOpen &&
			createPortal(
			<ChallengePopUp invitedBy={invitedBy} onCancel={handleCancelClick} socket_game={GameSocket} />,
			document.body
			)}
    </>
  );
};

export default Landing;
