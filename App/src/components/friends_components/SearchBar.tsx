import React, { useState } from 'react';
import { Users } from './SearchUser';
import { SearchBarWrapper } from './styles/SearchBar.styled';
import axios from 'axios';

interface SearchBarProps {
  placeholder: string;
  data: Users[];
}

const SearchBar: React.FC<SearchBarProps> = ({placeholder, data}) => {
	const [filteredData, setFilteredData] = useState<Users[]>([]);
	const [wordEntered, setWordEntered] = useState("");
	const [addFriendError, setAddFriendError] = useState("");
  
	const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
	  const searchWord = event.target.value;
	  setWordEntered(searchWord);
	  const newFilter = data.filter((value) => {
		return value.userName.toLowerCase().includes(searchWord.toLowerCase());
	  });
  
	  if (searchWord === "") {
		setFilteredData([]);
	  } else {
		setFilteredData(newFilter);
	  }
	};

	const handleAddFriend = async () => {
		console.log("add friend button");
		setFilteredData([]);
    	setWordEntered("");

		const updateDTO = {
			userName: wordEntered
		  };
	  
		  try {
			const response = await axios.post(
			  `${import.meta.env.VITE_BACKEND_URL}/friend/addFriend`,
			  updateDTO,
			  { withCredentials: true },
			);
			console.log(response);
			console.log(wordEntered + " succesfully added.");
		  } catch (error) {
			console.log(error);
			setAddFriendError(wordEntered + " doesn't exist.")
		  }
	  };
  
	return (
	  <SearchBarWrapper>
		<div className="searchInputs">
		  <input
			type="text"
			placeholder={placeholder}
			value={wordEntered}
			onChange={handleFilter}
		  />
		  <button onClick={handleAddFriend}>Add Friend</button>
		</div>
		{addFriendError && (
            <div style={{ color: "red", fontSize: "12px" }}>{addFriendError}</div>
          )}
		<div className="dataResultContainer">
		{filteredData.length != 0 && (
		  <div className="dataResult">
			{filteredData.slice(0, 15).map((value, key) => {
			  return (
				  <p key={key}>{value.userName} </p>
			  );
			})}
		</div>
		)}
		</div>
	  </SearchBarWrapper>
	);
}

export default SearchBar;
