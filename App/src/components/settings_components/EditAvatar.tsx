import React, { useEffect, useState } from "react";
import axios from "axios";
import { AvatarImage, EditAvatarWrapper, EditButton, UserInfoWrapper, Username } from "./styles/EditAvatar.styled";

const BASE_URL = "http://localhost:3000";

const getUser = async () => {
  const response = await axios.get(`${BASE_URL}/user/me`, { withCredentials: true });
  return response.data;
};

const EditAvatar: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [avatarPath, setAvatarPath] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    getUser()
      .then((data) => {
        setUsername(data.userName);
        setAvatarPath(data.avatar);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [username, avatarPath]);

  const handleUpload = async () => {
	if (selectedFile) {
	  const formData = new FormData();
	  formData.append("avatar", selectedFile);

	  try {
      const response = await axios.patch(`${BASE_URL}/user/update`, formData, {
        withCredentials: true,
        headers: {
        "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error uploading avatar:", error);
	  }
	}
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <EditAvatarWrapper>
      <AvatarImage src={`data:image/png;base64,${avatarPath}`} alt="User Avatar" />
      <UserInfoWrapper>
        <Username>{username}</Username>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          ref={(input) => input && (input.value = "")}
        />
        <EditButton onClick={() => (document.querySelector("input[type='file']") as HTMLInputElement | null)?.click()}>+ Choose Avatar</EditButton>
        <EditButton onClick={handleUpload}>+ Upload Avatar</EditButton>
      </UserInfoWrapper>
    </EditAvatarWrapper>
  );
};

export default EditAvatar;
