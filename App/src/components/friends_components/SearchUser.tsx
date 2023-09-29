import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import axios from "axios";

export interface Users {
	avatar: string;
	gamesPlayed: number;
	gamesWon: number;
	status: string;
	userName: string;
}

const SearchUser: React.FC = () => {
	const [UsersList, setUsersList] = useState<Users[]>([]);

	const getUsersList = async () => {
		try {
		  const response = await axios.get(
			`${import.meta.env.VITE_BACKEND_URL}/user/all-users`,
			{ withCredentials: true }
		  );
		  setUsersList(response.data);
		} catch (error) {
		  console.log(error);
		}
	};
	
	useEffect(() => {
		getUsersList();
	  }, []); // Add an empty dependency array to run this effect only once

  return (
      <SearchBar placeholder="<Enter Username>" data={UsersList} />
  );
}

export default SearchUser;