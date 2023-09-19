import Landing from "./Landing";
import PageContainer from "../components/PageContainer";
import ProfileAvatar from "../components/profile_components/ProfileAvatar";
// import UserStats from "../components/profile_components/UserStats";
// import MatchHistory from "../components/profile_components/ProfilesContainer";
// import BadgesInfos from "../components/profile_components/BadgesInfos";
// import BarCode from "../components/profile_components/BarCode";

const Profile = () => {
  return (
    <>
      <Landing />
      <PageContainer type="other">
        <ProfileAvatar />
        {/* <BarCode />
            <UserStats />
            <MatchHistory />
            <BadgesInfos /> */}
      </PageContainer>
    </>
  );
};

export default Profile;
