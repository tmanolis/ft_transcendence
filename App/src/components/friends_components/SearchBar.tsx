import React, { useState } from 'react';
import { Users } from './SearchUser';

interface SearchBarProps {
  placeholder: string;
  data: Users[];
}

const SearchBar: React.FC<SearchBarProps> = ({placeholder, data}) => {
	const [filteredData, setFilteredData] = useState<Users[]>([]);
	const [wordEntered, setWordEntered] = useState("");
  
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
  
	return (
	  <div className="search">
		<div className="searchInputs">
		  <input
			type="text"
			placeholder={placeholder}
			value={wordEntered}
			onChange={handleFilter}
		  />
		</div>
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
	);
}

export default SearchBar;
