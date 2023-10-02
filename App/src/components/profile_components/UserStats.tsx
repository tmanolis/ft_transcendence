import React from 'react';
import { UserStatsStyled, UserStatsBlock, Rank, WinRateBlock, WinLossBar } from './styles/UserStats.styled';

type UserStatsProps = {
	gamesPlayed: number;
	gamesWon: number;
	place: number;
};

const UserStats: React.FC<UserStatsProps> = ({gamesPlayed, gamesWon, place}) => {

  return (
    <UserStatsStyled>
      <Rank>#RANK {place}</Rank>
      <UserStatsBlock>
        <h1>Win Rate</h1>
        <WinRateBlock>
          <span>
            <p>Match Played : {30}</p>
            <p>Match Won : {2}</p>
            <p>Match Lost : {30 - 28}</p>
          </span>
        <WinLossBar $winRatio={2 / 33} />
        </WinRateBlock>
      </UserStatsBlock>
    </UserStatsStyled>
  );
};

export default UserStats;