import React from "react";

import { ClassicPongButton } from "./styles/ClassicPongButton.styled";
import { RetroPongButton } from "./styles/RetroPongButton.styled";
import { PlayWrapper } from "./styles/PlayWrapper.styled";

import { GameSocket } from "../GameSocket";

const LobbyComponent: React.FC = () => {


  const handlePlayClassicPong = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (!GameSocket.connected) {
      location.reload();
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
