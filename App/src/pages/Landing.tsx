import { useState } from "react";
import AvatarButton from "../components/landing_components/AvatarButton";
import LandingButton from "../components/landing_components/LandingButton";
import NavBar from "../components/landing_components/NavBar";
import AvatarBar from "../components/landing_components/AvatarBar";
import LandingContainer from "../components/landing_components/styles/LandingContainer.styled";

const Landing: React.FC = () => {
    const [menuBarIsShown, setMenuBarIsShown] = useState(false);
    const [avatarBarIsShown, setAvatarBarIsShown] = useState(false);
  
    const handleLandingClick = () => {
        setMenuBarIsShown((current) => !current);
    };

    const handleAvatarClick = () => {
        setAvatarBarIsShown((current) => !current);
    };

    const userImageSrc = "../../public/icon/Avatar.svg";

    return (
        <>
            <LandingContainer>
                <LandingButton onClick={handleLandingClick} navBar={menuBarIsShown} />
                <AvatarButton userImageSrc={userImageSrc} onClick={handleAvatarClick} avaBar={avatarBarIsShown}/>
            </LandingContainer>
            {menuBarIsShown && <NavBar />}
            {avatarBarIsShown && <AvatarBar />}
        </>
    );
}

export default Landing;