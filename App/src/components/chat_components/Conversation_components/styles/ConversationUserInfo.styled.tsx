import styled from "styled-components";

export const UserBannerStyled = styled.div`
  width: 90%;
  height: 55px;
  flex-shrink: 0;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  background: #000;
  box-shadow: 2px 2px 0px 0px rgba(157, 157, 157, 0.25);
  margin-bottom: 5px;

  display: flex;
  justify-content: space-between;
  align-items: center; /* Center content vertically */
  padding: 0 10px; /* Add padding to adjust spacing */
`;

export const UserDetails = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 100%;
    height: auto;
    border-radius: 50%;
    margin-right: 10px; /* Increase margin for more spacing */
  }

  p {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    padding-left: 1%;
  }
`;

export const SocialActions = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
  padding-left: 6%;

    img {
      width: 18%;
      border-radius: 0;
      margin-right: 5%;
      margin-left: 5%;
    }
`;

export const ActionButtons = styled.img`
  height: auto;
  cursor: pointer;
  transition: filter 0.2s ease-in-out;

  filter: ${(props) => (props.isActive ? "invert(100%)" : "invert(30%)")};

  &:hover {
    filter: invert(100%);
  }
`