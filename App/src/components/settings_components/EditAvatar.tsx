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

const getUser = async () => {
	const response = await axios.get(`${BASE_URL}/user/me`, { withCredentials: true })
	return response.data;
}

const EditAvatar: React.FC = () => {

	const [username, setUsername] = useState<string>("");

	useEffect( () => {
		getUser().then(data => {setUsername(data.userName);})
		.catch(error => {console.log(error)});
	
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