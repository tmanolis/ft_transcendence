import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BarCodeImg from "../../assets/code-barre.png";
import {
  ProfileAvatarStyled,
  AvatarImage,
  ProfileInfoBlock,
  UserStatus,
  CodeBar,
  SocialOption,
} from "./styles/ProfileAvatar.styled";
import axios from "axios";import { GameSocket } from "../GameSocket";

type ProfileAvatarProps = {
  avatarPath: string;
  username: string;
  userstatus: string;
};

interface Friend {
  avatar: string;
  gamesLost: number;
  gamesWon: number;
  status: string;
  userName: string;
}

function toTitleCase(input: string) {
  return `• ${input
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")}`;
}

const ProfileAvatarBlock: React.FC<ProfileAvatarProps> = ({
  username,
  avatarPath,
  userstatus,
}) => {
  const [userName, setUserName] = useState<string>("");
  const userImageSrc = `data:image/png;base64,${avatarPath}`;
  const EditedUserStatus = toTitleCase(userstatus);
  const [FriendsList, setFriendsList] = useState<Friend[]>([]);
  const [BlockList, setBlockList] = useState<string[]>([]);
  
  const isOwnProfile = username === userName;
  const isFriend = FriendsList.some((friend) => friend.userName === username);
  const isBlocked = BlockList.some((blockeduser) => blockeduser === username);

  const navigate = useNavigate();

  console.log("My Blocked user : ", BlockList)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/me`,
          {
            withCredentials: true,
          }
        );
        setUserName(response.data.userName);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();

    GameSocket.on('errorGameInvite', (message) => {
      console.log(message);
    })

    GameSocket.on('invitationSent', (message) => {
      navigate("/pong");
      console.log(message);
    })

    return () => {
      GameSocket.off('errorGameInvite');
    }
  }, []);

  useEffect(() => {
    getFriendsList();
  }, []); // Add an empty dependency array to run this effect only once

  const getFriendsList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/friend/friendList`,
        { withCredentials: true }
      );
      console.log(response);
      setFriendsList(response.data.friendList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddFriend = async () => {

    const updateDTO = {
      userName: username
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/friend/addFriend`,
        updateDTO,
        { withCredentials: true },
      );
      console.log(response);
      console.log(username + " succesfully added.");
      const newFriend: Friend = {
        avatar: "",
        gamesLost: 0,
        gamesWon: 0,
        status: "",
        userName: username,
      };

      setFriendsList([...FriendsList, newFriend]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfriend = async () => {

    const updateDTO = {
      userName: username
    };

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/friend/unfriend`,
        updateDTO,
        { withCredentials: true },
      );
      console.log(response);
      console.log(username + " succesfully unfriended.");
      setFriendsList(FriendsList.filter((friend) => friend.userName !== username));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBlockList();
  }, []);

  const getBlockList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/blockList`,
        { withCredentials: true }
      );
      console.log(response);
      setBlockList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlock = async () => {

    const updateDTO = {
      userName: username
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/block`,
        updateDTO,
        { withCredentials: true },
      );
      console.log(response);
      console.log(username + " succesfully blocked.");

      setBlockList([...BlockList, username]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnblock = async () => {
    const updateDTO = {
      userName: username
    };
  
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/user/unblock`,
        {
          data: updateDTO,
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.status === 200) {
        console.log(`${username} successfully unblocked.`);
        setBlockList(BlockList.filter((blockeduser) => blockeduser !== username));
      } else {
        console.error(`Failed to unblock ${username}. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error('An error occurred while unblocking:', error);
    }
  };
  
  const handleChallenge = async () => {
    console.log("challenge me!!!", username);
    GameSocket.emit("inviteUserToPlay", username);
  }

  return (
    <ProfileAvatarStyled>
      <AvatarImage src={userImageSrc} />
      <ProfileInfoBlock>
        <h1>{username}</h1>
        <UserStatus $userstatus={userstatus}>{EditedUserStatus}</UserStatus>
        <>
          {!isOwnProfile && (
            <SocialOption>
              {isFriend ? (
                <button onClick={handleUnfriend}>- Unfriend</button>
              ) : (
                <button onClick={handleAddFriend}>+ Add</button>
              )}
              {isBlocked ? (
                <button onClick={handleUnblock}>o UnBlock</button>
              ) : (
                <button onClick={handleBlock}>x Block</button>
              )}
              <button onClick={handleChallenge}>
                <span className="icon-before" /> Challenge Player
              </button>
            </SocialOption>
          )}
        </>
      </ProfileInfoBlock>
      <CodeBar src={`${BarCodeImg}`} alt="code-barre" />
    </ProfileAvatarStyled>
  );
};

export default ProfileAvatarBlock;
