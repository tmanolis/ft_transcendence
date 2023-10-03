import React from "react";
import styled from "styled-components";

export type ProfileAvatar = {
  children?: React.ReactNode;
  User?: () => void;
  userImageSrc?: string;
  status: string;
};

export const ProfileAvatarStyled = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 50px;
`;

export const AvatarImage = styled.img`
  width: 139.809px;
  height: 136px;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 139.809px;
  border: 2px solid var(--linear-white, #faf2f2);
  background:
    url(<path-to-image>),
    lightgray 50% / cover no-repeat;

  margin-right: 20px;
`;

const statusColors = {
  ONLINE: "green",
  OFFLINE: "red",
  PLAYING: "blue",
  AWAY: "orange",
};

export const UserStatus: React.FC<ProfileAvatar> = styled.div`
  display: flex;
  text-align: center;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%; /* 466.667% */
  letter-spacing: 0.3px;
  color: ${(props) =>
    statusColors[props.status as keyof typeof statusColors] || "white"};
`;

export const ProfileInfoBlock = styled.div`
  width: 159.641px;
  height: 107px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  h1 {
    color: white;
    /* display: flex; */
    font-size: 30px;
    font-style: normal;
    font-weight: 500;
    line-height: 200%; /* 233.333% */
    letter-spacing: 0.6px;
    margin: 0;
  }
`;
