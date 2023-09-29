import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router';


import WhitePopUp from "./styles/WhitePopUp.styled";
import { ClassicPongButton } from "./styles/ClassicPongButton.styled";
import { RetroPongButton } from "./styles/RetroPongButton.styled";
import { PlayWrapper } from "./styles/PlayWrapper.styled";

const LobbyComponent: React.FC = () => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
  }, []);

  const handlePlayClassicPong = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    navigate("/pong");
    setIsWaiting(true);
  };

  const handlePlayRetroPong = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    navigate("/pong");
    setIsWaiting(true);
  };

  return (
    <>
        <PlayWrapper>
          <ClassicPongButton onClick={handlePlayClassicPong} />
          <RetroPongButton onClick={handlePlayRetroPong} />
          {isWaiting && (<WhitePopUp></WhitePopUp>)}
        </PlayWrapper>
    </>
  );
};

export default LobbyComponent;
