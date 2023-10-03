import PageContainer from "../components/PageContainer";
import LobbyComponent from "../components/play_components/LobbyComponent";
import Landing from "../pages/Landing";

const Play = () => {
  return (
    <>
      <Landing />
      <PageContainer>
        <LobbyComponent />
      </PageContainer>
    </>
  );
};

export default Play;
