import { useState } from "react";
import PSSButton from "./styles/LandingButton.styled";
import MenuBar from "./MenuBar"; // Import the NavBarIcon component

export default function LandingButton() {
  const [IsShown, setIsShown] = useState(false);

  const handleButtonClick = () => {
    setIsShown((prevState) => !prevState);
  };

  return (
    <>
        <PSSButton onClick={handleButtonClick}>
        <h1>. /</h1>
        </PSSButton>
        {IsShown && <MenuBar />}
    </>
  );
}
