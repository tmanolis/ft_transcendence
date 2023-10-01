import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { UserStatsStyled, UserStatsBlock, Rank, WinRateBlock, WinLossBar } from './styles/UserStats.styled';

interface Profile {
	avatar: string;
	gamesPlayed: number;
	gamesWon: number;
	place: number;
	userName: string;
}

const UserStats: React.FC = () => {
  const [profilesList, setProfilesList] = useState<Profile[]>([]);
  const [profileData, setProfileData] = useState<Profile | null>(null); // Initialize userData as null
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
          withCredentials: true,
        });
        setUsername(response.data.userName);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [username]);

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
    const myProfile = profilesList.find((profile: Profile) => profile.userName === username);
  
    if (myProfile) {
      // If found, set profileData to the profile data
      setProfileData(myProfile);
    }
  }, [profilesList, username]);

  useEffect(() => {
    getProfilesList();
  }, []);

  return (
    <UserStatsStyled>
      {profileData ? (
      <>
        <Rank>#RANK {profileData.place}</Rank>
        <UserStatsBlock>
          <h1>Win Rate</h1>
          <WinRateBlock>
            <div>
              <p>Match Played : {profileData.gamesPlayed}</p>
              <p>Match Won : {profileData.gamesWon}</p>
              <p>Match Lost : {profileData.gamesPlayed - profileData.gamesWon}</p>
            </div>
            <WinLossBar winRatio={profileData.gamesWon / profileData.gamesPlayed} />
          </WinRateBlock>
        </UserStatsBlock>
      </>
      ) : (
        <p>Loading...</p> // You can show a loading indicator here
      )}
    </UserStatsStyled>
  );
};

export default UserStats;