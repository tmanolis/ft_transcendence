import React from "react";
import styled from "styled-components";

export type WhitePopUpProps = {
  children?: React.ReactNode;
};

const StyledWhitePopUp = styled.div`
  /* display: flex; */
  width: 398px;
  height: 521px;
  background: #FFFFFF;
  border: 1px solid #FFFFFF;
  box-shadow: inset -5px -5px 0px #727272;
  color: #000000;
  padding: 10px;

  /* Add responsive styles */
  @media (max-width: 768px) {
    width: 90%;
    height: auto;
    width: 90%;
    height: auto;
    max-height: 90vh; /* Limit the maximum height to 90% of viewport height */
    overflow-y: auto; /* Add vertical scroll if content overflows */    
  }
`;

const WhitePopUp: React.FC<WhitePopUpProps> = ({ children }) => {
  return (
      <StyledWhitePopUp>{children}</StyledWhitePopUp>
  );
};

export default WhitePopUp;
