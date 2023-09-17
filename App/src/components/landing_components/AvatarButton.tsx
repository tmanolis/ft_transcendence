import React, { useState, useEffect } from "react";
import Avatar from "./styles/AvatarButton.styled";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const AvatarButton: React.FC = () => {
  const [avatarPath, setAvatarPath] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/me`, { withCredentials: true });
        setAvatarPath(response.data.avatar);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const handleAvatarClick = () => {

  };

  return <Avatar userImageSrc={`data:image/png;base64,${avatarPath}`} onClick={handleAvatarClick} />;
};

export default AvatarButton;
