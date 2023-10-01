import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { AchievementsBlock, AchievementsStyled } from './styles/AchievementsInfos.styled';

interface Profile {
	avatar: string;
	gamesPlayed: number;
	gamesWon: number;
	place: number;
	userName: string;
}

const AchievementsInfos: React.FC = () => {

  return (
    <AchievementsStyled>
        <h1>Achievements</h1>
        <AchievementsBlock>
            <div></div>
        </AchievementsBlock>
    </AchievementsStyled>
  );
};

export default AchievementsInfos;