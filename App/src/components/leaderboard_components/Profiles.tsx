import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ProfileContainer, ProfilesListWrapper } from './styles/Profiles.styled';

interface Profile {
	avatar: string;
	gamesPlayed: number;
	gamesWon: number;
	place: number;
	userName: string;
}

const Profiles: React.FC = () => {
  const [profilesList, setProfilesList] = useState<Profile[]>([]);

  const getProfilesList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/leaderboard`,
        { withCredentials: true }
      );
      console.log(response);
      setProfilesList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfilesList();
  }, []); // Add an empty dependency array to run this effect only once

  return (
    <ProfilesListWrapper>
        {Item(profilesList)}
    </ProfilesListWrapper>
  );
}

export default Profiles;

function Item(data: Profile[]) {
  return (
    <>
      {data.map((value, index) => (
        <ProfileContainer key={index}>
          <div className="avatar">
            <img src={`data:image/png;base64,${value.avatar}`} alt="user_avatar" />
          </div>
          <h3>{value.userName}</h3>
          <div className="rank">#Rank {value.place}</div>
          <div className="gamesPlayed">{value.gamesPlayed}</div>
        </ProfileContainer>
      ))}
    </>
  );
}
