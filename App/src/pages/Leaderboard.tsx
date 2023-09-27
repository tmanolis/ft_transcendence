import PageContainer from "../components/PageContainer";
import Profiles from "../components/leaderboard_components/Profiles";
import Landing from "../pages/Landing";

const Leaderboard = () => {
  return (
    <>
      <Landing />
      <PageContainer type="other">
        <h2 style={{ margin: "30px", paddingLeft: "12px", fontSize: "30px"}}>
          Leaderboard
        </h2>
        <Profiles />
      </PageContainer>
    </>
  )
};

export default Leaderboard;
