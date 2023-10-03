import axios from "axios";
import { LostBadge, MatchElementStyled, VersusInfo, WinBadge } from "./styles/MatchElement.styled";
import React, { useEffect, useState } from "react";

export interface GameListInter {
	gameId: number;
	players: {
		userName: string;
	}[];
	createdAt: Date;
	updatedAt: Date;
	winnerId: string;
	userWon: boolean;
}

type MatchElementProps = {
	game: GameListInter;
	profileUser: string;
};

const MatchElement: React.FC<MatchElementProps> = ({ game, profileUser }) => {
	const [versUsername, setVersUsername] = useState("");
	const [versusAvatar, setVersusAvatar] = useState("")

	useEffect(() => {
		const differentUsername = game.players.find(
			(player) => !profileUser.includes(player.userName)
		);

		if (differentUsername) {
			setVersUsername(differentUsername.userName);
		}
	}, [game, profileUser]);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BACKEND_URL
					}/user/gameHistory?userName=${versUsername}`,
					{
						withCredentials: true,
					}
				);
				setVersusAvatar(response.data.avatar);
			} catch (error) {
				console.error(error);
			}
		};
		fetchUserData();
	}, [versUsername]);

  return (
    <MatchElementStyled>
      <VersusInfo>
        <img
          src={`data:image/png;base64,${versusAvatar}`}
          alt={`Avatar of ${versUsername}`}
        />
        <p>{versUsername}</p>
      </VersusInfo>
      {game.userWon ? (
        <WinBadge>Win</WinBadge>
      ) : (
        <LostBadge>Lost</LostBadge>
      )}
    </MatchElementStyled>
  );
};

export default MatchElement;