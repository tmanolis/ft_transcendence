import Landing from "./Landing";
import PageContainer from "../components/PageContainer";
import ProfileAvatar from "../components/profile_components/ProfileAvatar";
import UserStats from "../components/profile_components/UserStats";
import MatchHistory from "../components/profile_components/MatchHistory";
import AchievementsInfos from "../components/profile_components/AchievementsInfos";
import styled from "styled-components";

const ProfileContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  @media (max-width: 960px) {
  	display: flex;
    flex-direction: column; /* Switch to a column layout */    
    align-items: center;
  }
`;

const LeftColumn = styled.div`
  flex: 1;
`;

const RightColumn = styled.div`
  flex: 1;
`;


const Profile = () => {
  return (
    <>
      <Landing />
      <PageContainer type="other">
      <ProfileAvatar />
      <ProfileContainer>
          <LeftColumn>
            <UserStats />
            <AchievementsInfos />
          </LeftColumn>
          <RightColumn>
            <MatchHistory />
          </RightColumn>
        </ProfileContainer>
      </PageContainer>
    </>
  );
};

export default Profile;
