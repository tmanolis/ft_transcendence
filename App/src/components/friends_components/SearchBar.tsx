import React, { useState } from 'react';
import { Users } from './SearchUser';
import { SearchBarWrapper } from './styles/SearchBar.styled';
import axios from 'axios';
import ConfirmButton from '../settings_components/styles/ConfirmButton.styled';

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

	const handleAutofill = (username: string) => {
		setWordEntered(username);
		setFilteredData([]);
	}

	const handleAddFriend = async () => {
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
			window.location.reload();
		  } catch (error) {
			console.log(error);
			setAddFriendError("Can't add " + wordEntered)
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
		  <ConfirmButton type="submit" onClick={handleAddFriend}>Add Friend</ConfirmButton>
		</div>
		{addFriendError && (
            <div style={{ color: "red", fontSize: "12px", margin: "10px" }}>{addFriendError}</div>
          )}
		<div className="dataResultContainer">
		{filteredData.length != 0 && (
		  <div className="dataResult">
			{filteredData.slice(0, 15).map((value, key) => {
			  return (
				  <p style={{ margin: "3px"}} onClick={() => handleAutofill(value.userName)} key={key}>{value.userName} </p>
			  );
			})}
		</div>
		)}
		</div>
	  </SearchBarWrapper>
	);
}

export default SearchBar;
