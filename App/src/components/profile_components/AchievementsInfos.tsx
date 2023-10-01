import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { AchievementsBlock, AchievementsStyled } from './styles/AchievementsInfos.styled';

interface Achievement {
  id: number;
  imagePath1: string;
  imagePath2: string;
  message: string;
}

const AchievementsInfos: React.FC = () => {

  const badges: Achievement[] = [
    {
      id: 1,
      imagePath1: '/path-to-image-1.svg',
      imagePath2: '/path-to-image-1.svg',
      message: 'Achievement 1 message',
    },
    {
      id: 2,
      imagePath1: '/path-to-image-1.svg',
      imagePath2: '/path-to-image-1.svg',
      message: 'Achievement 2 message',
    },
    // Add more achievement objects as needed
  ];

  const [achievements, setAchievements] = useState<[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
          withCredentials: true,
        });
        setAchievements(response.data.achievements);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [achievements]);
  
  return (
    <AchievementsStyled>
        <h1>Achievements</h1>
        <AchievementsBlock>
          {achievements.map((badges) => (
            <img
              key={badges.id}
              src={profileData ? profileData.gamesPlayed > badges.id ? badges.imagePath : '/default-image.svg' : '/default-image.svg'}
              alt={`Achievement ${achievement.id}`}
              title={badges.message}
            />
          ))}
        </AchievementsBlock>
    </AchievementsStyled>
  );
};

export default AchievementsInfos;