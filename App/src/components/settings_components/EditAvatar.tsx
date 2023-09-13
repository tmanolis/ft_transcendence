import React from "react";
import styled from "styled-components";

const AvatarImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;

const userImageSrc = "../../public/icon/Avatar.svg";

const EditAvatar: React.FC = () => {

	return (
		<>
		<AvatarImage src={userImageSrc} alt="User Avatar" />
		<span>Username</span>
		<button>Edit Avatar</button>
		</>
	);
};

export default EditAvatar