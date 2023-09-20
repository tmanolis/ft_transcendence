import React from "react";
import styled from "styled-components";

export type WhitePopUpProps = {
  children?: React.ReactNode;
};

const StyledWhitePopUp = styled.div`
  /* Initial styles for larger screens */
  width: 398px;
  height: 521px;
  background: #ffffff;
  border: 1px solid #ffffff;
  box-shadow: inset -5px -5px 0px #727272;
  color: #000000;
  padding: 10px;

  /* Center the element both horizontally and vertically */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  /* Add responsive styles for smaller screens */
  @media (max-width: 768px) {
    width: 90%;
    height: auto;
    max-height: 90vh;
    overflow-y: auto;
  }
`;

const WhitePopUp: React.FC<WhitePopUpProps> = ({ children }) => {
  return <StyledWhitePopUp>{children}</StyledWhitePopUp>;
};

export default WhitePopUp;
