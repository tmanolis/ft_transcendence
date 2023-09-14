import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const AvatarImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;

const userImageSrc = "../../public/icon/Avatar.svg";

const BASE_URL = "http://localhost:3000";

// async function getUser() {

// 	const response = await fetch(`http://localhost:3000/user/me`);
// 	const data = await response.json()
// 							   .then( (data) => { return data;})
// 							   .catch((error) => { console.error(error)});
// 	const users = data;

// 	console.log("users, ", users);
// 	return users;
// }

const getUser = async () => {
	const response = await axios.get(`http://localhost:3000/user/me`, { withCredentials: true })
	return response.data;
}	

const EditAvatar: React.FC = () => {

	const [username, setUsername] = useState<string>("");

	useEffect( () => {
		getUser().then(data => {
			console.log(data);
			setUsername(data.userName);
		});
	
		// console.log(" user: user", user);
	
	}, [username]);

	return (
		<>
		<AvatarImage src={userImageSrc} alt="User Avatar" />
		<span>{username}</span>
		<button>Edit Avatar</button>
		</>
	);
};

export default EditAvatar