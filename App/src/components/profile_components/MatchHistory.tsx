import {
  MatchHistoryStyled,
  HistoryScrollingList,
} from "./styles/MatchHistory.styled";
import MatchElement, { GameListInter } from "./MatchElement";

type MatchHistoryProps = {
  gameList: GameListInter[];
  profileUser: string;
};

const MatchHistory: React.FC<MatchHistoryProps> = ({ gameList, profileUser }) => {

  return (
    <MatchHistoryStyled>
      <h1>Match History</h1>
      <HistoryScrollingList>
        {gameList.map((game, index) => (
          <MatchElement key={index} game={game} profileUser={profileUser} />
        ))}
      </HistoryScrollingList>
    </MatchHistoryStyled>
  );
};

export default MatchHistory;
