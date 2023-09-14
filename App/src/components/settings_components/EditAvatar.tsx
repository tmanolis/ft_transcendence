import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const AvatarImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;

// const userImageSrc = "../../public/img/defaultAvatar.jpg";

const BASE_URL = "http://localhost:3000";

const getUser = async () => {
	const response = await axios.get(`${BASE_URL}/user/me`, { withCredentials: true })
	return response.data;
}

const EditAvatar: React.FC = () => {

	const [username, setUsername] = useState<string>("");
	const [avatarPath, setAvatarPath] = useState<string>("");

	useEffect( () => {
		getUser()
		.then(data => {
			setUsername(data.userName);
			setAvatarPath(data.avatar);})
		.catch(error => {console.log(error)});
	
	}, [username]);

	return (
		<>
		{/* <AvatarImage src={avatarPath} alt="User Avatar" /> */}
		<AvatarImage src={`data:image/png;base64,${avatarPath}`} alt="User Avatar" />
		<span>{username}</span>
		<button>Edit Avatar</button>
		</>
	);
};

export default EditAvatar

