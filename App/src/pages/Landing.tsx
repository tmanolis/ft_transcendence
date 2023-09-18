import { useState, useEffect } from "react";
import axios from "axios";
import AvatarButton from "../components/landing_components/AvatarButton";
import LandingButton from "../components/landing_components/LandingButton";
import NavBar from "../components/landing_components/NavBar";
import AvatarBar from "../components/landing_components/AvatarBar";
import LandingContainer from "../components/landing_components/styles/LandingContainer.styled";

const BASE_URL = "http://localhost:3000";

const getUser = async () => {
	const response = await axios.get(`${BASE_URL}/user/me`, { withCredentials: true })
	return response.data;
}

const Landing: React.FC = () => {
    const [menuBarIsShown, setMenuBarIsShown] = useState(false);
    const [avatarBarIsShown, setAvatarBarIsShown] = useState(false);
	const [avatarPath, setAvatarPath] = useState<string>("../../public/icon/Avatar.svg");

	useEffect( () => {
		getUser()
		.then(data => {
			setAvatarPath(data.avatar);})
		.catch(error => {console.log(error)});
	
	},);

    const handleLandingClick = () => {
        setMenuBarIsShown((current) => !current);
    };

    const handleAvatarClick = () => {
        setAvatarBarIsShown((current) => !current);
    };

    const userImageSrc = `data:image/png;base64,${avatarPath}`;

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