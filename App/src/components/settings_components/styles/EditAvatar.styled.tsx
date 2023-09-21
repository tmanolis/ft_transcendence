import styled from "styled-components";

export const EditAvatarWrapper = styled.div`
  display: flex; /* Display children side by side */
  align-items: center; /* Vertically align children */
  margin: 10px; /* Add margin for spacing */
`;

export const AvatarImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
`;

export const UserInfoWrapper = styled.div`
  margin-left: 20px; /* Add some spacing between AvatarImage and UserInfoWrapper */
`;

export const Username = styled.p`
margin-top: 5px;
margin-bottom: 5px;
color: #000;
font-family: "JetBrains Mono",monospace;
font-size: 19px;
font-style: normal;
font-weight: 550;
`;

export const EditButton = styled.button`
border-top: 1px solid #FFF;
border-left: 1px solid #FFF;
background: #000;
box-shadow: 2px 2px 0px 0px rgba(157, 157, 157, 0.25);
padding: 2px;
margin-right: 6px;

color: #FFF;
font-family: "JetBrains Mono",monospace;
font-size: 10px;
font-style: normal;
font-weight: 400;
letter-spacing: 0.2px;
`;