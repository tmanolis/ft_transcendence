import PageContainer from "../components/PageContainer";
import FriendsList from "../components/friends_components/FriendsList";
import Landing from "../pages/Landing";

const Leaderboard = () => {
  return (
    <>
      <Landing />
      <PageContainer type="other">
        <h2 style={{ margin: "30px", paddingLeft: "12px", fontSize: "30px"}}>
          Friends
        </h2>
        <div>Search Friends</div>
        <FriendsList />
      </PageContainer>
    </>
  )
};

export default Leaderboard;