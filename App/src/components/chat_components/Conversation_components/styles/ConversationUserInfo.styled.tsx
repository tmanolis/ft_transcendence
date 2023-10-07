import styled from "styled-components";

export const UserDetails = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  height: 50px;
  flex-shrink: 0;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  background: #000;
  box-shadow: 2px 2px 0px 0px rgba(157, 157, 157, 0.25);
  margin-bottom: 5px;

  padding: 10px 10px; /* Add padding to adjust spacing */

  img {
    width: 55px;
    height: auto;
    border-radius: 50%;
    margin-right: 10px;

    @media screen and (max-width: 500px) {
      width: 40px;
      margin-right: 5px;
    }
  }

  p {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    padding-left: 1%;

    @media screen and (max-width: 500px) {
      font-size: 12px;
    }
  }

  @media screen and (max-width: 500px) {
    justify-content: flex-start;
    height: 40px;
    width: 350px;
  }
`;

export const SocialActions = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 10px;

  @media screen and (max-width: 500px) {
    padding-left: 0;
  }

    img {
      width: 30px;
      border-radius: 0;
      margin-right: 5%;
      margin-left: 5%;

      @media screen and (max-width: 500px) {
      width: 20px;
      margin-right: 0;
      margin-left: 5px;
    }
    }
`;

type SocialIconProps = {
  $isactive?: boolean;
};

export const ActionButtons = styled.img<SocialIconProps>`
  height: auto;
  cursor: pointer;
  transition: filter 0.2s ease-in-out;

  filter: ${(props) => (props.$isactive ? "invert(100%)" : "invert(30%)")};

  &:hover {
    filter: invert(100%);
  }
`;

const statusColors = {
  ONLINE: "green",
  OFFLINE: "red",
  PLAYING: "blue",
  AWAY: "orange",
};

export const UserStatus = styled.div<{ $userstatus?: string }>`
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%; /* 466.667% */
  letter-spacing: 0.4px;
  margin-right: 3%;
  padding-left: 50px;
  color: ${(props) =>
    statusColors[props.$userstatus as keyof typeof statusColors] || "white"};

  @media screen and (max-width: 500px) {
    padding-left: 5px;
  }

  /* Add space between bullet and status */
  &::before {
    content: "•"; /* Add bullet point */
    margin-right: 4px; /* Adjust the space */
  }
`;