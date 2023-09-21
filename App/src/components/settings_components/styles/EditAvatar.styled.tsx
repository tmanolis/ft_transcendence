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