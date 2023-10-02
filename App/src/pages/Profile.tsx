import Landing from "./Landing";
import PageContainer from "../components/PageContainer";
import ProfileAvatar from "../components/profile_components/ProfileAvatar";
import UserStats from "../components/profile_components/UserStats";
import MatchHistory from "../components/profile_components/MatchHistory";
import AchievementsInfos from "../components/profile_components/AchievementsInfos";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";

interface Profile {
	avatarPath: string;
	userName: string;
  userstatus: string;
	gamesPlayed: number;
	gamesWon: number;
  gamesLost: number;
	place: number;
  achievements: [];
  matchHistory: [];
}

interface profileLead {
	avatar: string;
	gamesPlayed: number;
	gamesWon: number;
	place: number;
	userName: string;
}

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

const Profile: React.FC = () => {
    const [profileData, setProfileData] = useState<Profile>();
    const [profilesList, setProfilesList] = useState<profileLead[]>([])

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
            withCredentials: true,
          });
          const userData = response.data;
          setProfileData((prevProfileData) => {
            if (prevProfileData) {
              return {
                ...prevProfileData,
                avatarPath: userData.avatar,
                userName: userData.userName,
                userstatus: userData.status,
                gamesLost: userData.gamesLost,
                gamesWon: userData.gamesWon,
                gamesPlayed: userData.gamesLost + userData.gamesWon,
                achievements: userData.achievements,
              };
            } else {
              return null;
            }
          });
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchUserData();
    }, [profileData]);

    // useEffect(() => {
    //   const fetchUserData = async () => {
    //     try {
    //       const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
    //         withCredentials: true,
    //       });
    //       const userData = response.data;
    //       setProfileData({
    //         ...profileData,
    //         avatarPath: userData.avatar,
    //         userName: userData.userName,
    //         userstatus: userData.status,
    //         gamesLost: userData.gamesLost,
    //         gamesWon: userData.gamesWon,
    //         gamesPlayed: userData.gamesLost + userData.gamesWon,
    //         achievements: userData.achievements,
    //         place: userData.place || 0, // Provide a default value of 0 if place is undefined
    //         matchHistory: userData.matchHistory || [], // Provide an empty array if matchHistory is undefined
    //       });
          
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   };
  
    //   fetchUserData();
    // }, [profileData]);
  
    const getProfilesList = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/leaderboard`,
          { withCredentials: true }
        );
        console.log(response);
        setProfilesList(response.data);
      }
      catch (error) {
        console.log(error);
      }
    };
    
    useEffect(() => {
      const profilePlace = profilesList.find((profile: profileLead) => profile.userName === profileData?.userName);
    
      if (profilePlace) {
        // If found, set profileData to the profile data
        setProfileData((prevProfileData) => {
          if (prevProfileData) {
            return {
              ...prevProfileData,
              place: profilePlace,
            };
          } else {
            return null;
          }
          })
      }
    }, [profilesList, profileData?.userName]);
  
    useEffect(() => {
      getProfilesList();
    }, []);

  return (
    <>
      <Landing />
      <PageContainer type="other">
        {profileData ? (
          <>
            <ProfileAvatar userstatus={profileData.userstatus} username={profileData.userName} avatarPath={profileData.avatarPath} />
            <ProfileContainer>
              <LeftColumn>
                <UserStats gamesWon={profileData.gamesWon} gamesPlayed={profileData.gamesPlayed} place={profileData.place} />
                <AchievementsInfos achievements={profileData.achievements} />
              </LeftColumn>
                <RightColumn>
                  <MatchHistory/>
                </RightColumn>
              </ProfileContainer>
          </>
        ) : (
          <h1>Loading</h1>
        )}
      </PageContainer>
    </>
  );
};

export default Profile;