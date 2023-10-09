import React, { useEffect } from "react";
import { useNavigate } from 'react-router';

import { ClassicPongButton } from "./styles/ClassicPongButton.styled";
import { RetroPongButton } from "./styles/RetroPongButton.styled";
import { PlayWrapper } from "./styles/PlayWrapper.styled";

import { GameSocket } from "../GameSocket";

const LobbyComponent: React.FC = () => {

  const navigate = useNavigate();

  useEffect(() => {
    GameSocket.on("gameInvite", (message) => {
      console.log(message.invitedBy);
      GameSocket.emit('acceptInvitation', message.invitedBy);
    });
    GameSocket.on('gameReady', () => {
      navigate("/pong");
    });
    return () => {
      GameSocket.off("gameInvite");
      GameSocket.off('gameReady');
    }
  }, []);

  const handlePlayClassicPong = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    console.log(GameSocket.connected);
    if (!GameSocket.connected) {
      console.log("not connected to socket");
      GameSocket.connect();
    }
    await GameSocket.emit("findGame");
  };

  const handlePlayRetroPong = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    await GameSocket.emit("findRetroGame");
  };

  return (
    <>
        <PlayWrapper>
          <ClassicPongButton onClick={handlePlayClassicPong} />
          <RetroPongButton onClick={handlePlayRetroPong} />
        </PlayWrapper>
    </>
  );
};

export default LobbyComponent;
