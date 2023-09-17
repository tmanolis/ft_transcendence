import { useState } from "react";
import AvatarButton from "../components/landing_components/AvatarButton";
import LandingButton from "../components/landing_components/LandingButton";
import NavBar from "../components/landing_components/NavBar";
import AvatarBar from "../components/landing_components/AvatarBar";

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
            <LandingButton onClick={handleLandingClick} navBar={menuBarIsShown} />
            {menuBarIsShown && <NavBar />}
            <AvatarButton userImageSrc={userImageSrc} onClick={handleAvatarClick} avaBar={avatarBarIsShown}/>
            {avatarBarIsShown && <AvatarBar />}
        </>
    );
}

export default Landing;