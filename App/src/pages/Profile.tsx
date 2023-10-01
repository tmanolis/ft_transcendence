import Landing from "./Landing";
import PageContainer from "../components/PageContainer";
import ProfileAvatar from "../components/profile_components/ProfileAvatar";
import UserStats from "../components/profile_components/UserStats";
// import MatchHistory from "../components/profile_components/ProfilesContainer";
import AchievementsInfos from "../components/profile_components/AchievementsInfos";

const Profile = () => {
  return (
    <>
      <Landing />
      <PageContainer type="other">
        <ProfileAvatar />
        <UserStats />
        <AchievementsInfos />
        {/* <MatchHistory /> */}
      </PageContainer>
    </>
  );
};

export default Profile;
