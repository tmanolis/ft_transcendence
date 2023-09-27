import axios from 'axios';
import React, { useState, useEffect } from 'react';

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
    <div id="profile">
      {Item(profilesList)}
    </div>
  );
}

export default Profiles;

function Item(data: Profile[]) {
  return (
    <>
      {data.map((value, index) => (
        <div className="flex" key={index}>
          <div className="item">
            <img src={`data:image/png;base64,${value.avatar}`} alt="user_avatar" />
            <div className="info">
              <h3>{value.userName}</h3>
              <span>{value.place}</span>
            </div>
          </div>
          <div className="item">
            <span>{value.gamesPlayed}</span>
          </div>
        </div>
      ))}
    </>
  );
}
