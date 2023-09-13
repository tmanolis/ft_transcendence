import { useState } from "react";
import AvatarButton from "../components/AvatarButton";
import LandingButton from "../components/LandingButton";
import MenuBar from "../components/MenuBar";

const Landing: React.FC = () => {
    const [isShown, setIsShown] = useState(false);
  
    const handleButtonClick = () => {
      setIsShown((current) => !current);
    };

    return (
        <>
            <LandingButton onClick={handleButtonClick} navBar={isShown} />
            {isShown && <MenuBar />}
            <AvatarButton />
        </>
    );
}

export default Landing;