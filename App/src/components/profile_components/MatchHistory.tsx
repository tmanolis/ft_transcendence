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

  const uniqueGameList = gameList.filter((game, index, self) => {
    const createdAtString = new Date(game.createdAt).toISOString();
    return self.findIndex((g) => new Date(g.createdAt).toISOString() === createdAtString) === index;
  });

  return (
    <MatchHistoryStyled>
      <h1>Match History</h1>
      <HistoryScrollingList>
        {uniqueGameList.map((game, index) => (
          <MatchElement key={index} game={game} profileUser={profileUser} />
        ))}
      </HistoryScrollingList>
    </MatchHistoryStyled>
  );
};

export default MatchHistory;

