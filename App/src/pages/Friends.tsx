import PageContainer from "../components/PageContainer";
import FriendsList from "../components/friends_components/FriendsList";
import SearchUser from "../components/friends_components/SearchUser";
import { FriendsWrapper } from "../components/friends_components/styles/FriendsWrapper.styled";
import Landing from "../pages/Landing";

const Friends = () => {
  
  return (
    <>
      <Landing />
      <PageContainer type="other">
        <h2 style={{ margin: "30px", paddingLeft: "12px", fontSize: "30px"}}>
          Friends
        </h2>
        <FriendsWrapper>
          <SearchUser />
          <FriendsList />
        </FriendsWrapper>
      </PageContainer>
    </>
  )
};

export default Friends;