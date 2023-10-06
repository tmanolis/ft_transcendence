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
    GameSocket.on('retroGameReady', () => {
      navigate("/retropong");
    });
    return () => {
      GameSocket.off("gameInvite");
      GameSocket.off('gameReady');
      GameSocket.off('retroGameReady');
    }
  }, []);

  const handlePlayClassicPong = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (!GameSocket.connected) {
      GameSocket.connect();
    }
    await GameSocket.emit("findGame");
  };

  const handlePlayRetroPong = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (!GameSocket.connected) {
      GameSocket.connect();
    }
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
