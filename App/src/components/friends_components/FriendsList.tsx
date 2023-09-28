import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Avatar, FriendsListWrapper, FriendContainer, UserInfos, ProfileButton } from './styles/FriendsList.styled';

interface Profile {
	avatar: string;
	gamesPlayed: number;
	gamesWon: number;
	place: number;
	userName: string;
}

const FriendsList: React.FC = () => {
  const [FriendsList, setFriendsList] = useState<Profile[]>([]);

  const getFriendsList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/leaderboard`,
        { withCredentials: true }
      );
      console.log(response);
      setFriendsList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFriendsList();
  }, []); // Add an empty dependency array to run this effect only once

  return (
    <FriendsListWrapper>
        {Item(FriendsList)}
    </FriendsListWrapper>
  );
}

export default FriendsList;

function Item(data: Profile[]) {

	const handleClick = (username: string) => {
		console.log("See profile: " + username);
		// LATER: Add th request to go on other profile
	  }

  return (
    <>
      {data.map((value, index) => (
        <FriendContainer key={index}>
          <div className="avatar">
            <Avatar src={`data:image/png;base64,${value.avatar}`} alt="user_avatar" />
          </div>
          <UserInfos>{value.userName}<span>status</span></UserInfos>
          <ProfileButton onClick={() => handleClick(value.userName)}>See profile</ProfileButton>
        </FriendContainer>
      ))}
    </>
  );
}
