import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { AchievementsBlock, AchievementsStyled, AchievementImage, AchievementMessage } from './styles/AchievementsInfos.styled';

interface Achievement {
  id: number;
  name: string;
  imagePath1: string;
  imagePath2: string;
  message: string;
}

const AchievementsInfos: React.FC = () => {

  const badges: Achievement[] = [
    {
      id: 1,
      name: "FRIEND",
      imagePath1: '/icon/Friend_Lock.svg',
      imagePath2: '/icon/Friend_Unock.svg',
      message: 'Invite your first friend',
    },
    {
      id: 2,
      name: "JOIN",
      imagePath1: '/icon/Join_Lock.svg',
      imagePath2: '/icon/Join_Unock.svg',
      message: 'Join your first channel',
    },
    {
      id: 3,
      name: "TWOFA",
      imagePath1: '/icon/twofa_Lock.svg',
      imagePath2: '/icon/twofa_Unock.svg',
      message: 'Secure your account with 2FA authentification',
    },
    {
      id: 4,
      name: "FIRST",
      imagePath1: '/icon/First_Lock.svg',
      imagePath2: '/icon/First_Unock.svg',
      message: 'Be the first of the matrix',
    },
    {
      id: 5,
      name: "WINNER",
      imagePath1: '/icon/Winner_Lock.svg',
      imagePath2: '/icon/Winner_Unock.svg',
      message: 'Win a game',
    },
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

  const getImagePath = (name: string) => {
    const matchingAchievement = badges.find((badge) => badge.name === name);
    return matchingAchievement ? matchingAchievement.imagePath1 : matchingAchievement.imagePath2;
  };

  return (
    <AchievementsStyled>
        <h1>Achievements</h1>
        <AchievementsBlock>
          {badges.map((badge) => (
            <div key={badge.id}>
              <AchievementImage
                src={getImagePath(badge.name)}
                alt={`Achievement ${badge.id}`}
              />
              <AchievementMessage><h1>{badge.name}</h1>{badge.message}</AchievementMessage>
            </div>
          ))}
        </AchievementsBlock>
    </AchievementsStyled>
  );
};

export default AchievementsInfos;