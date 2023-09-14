import React from "react";
import styled from "styled-components";

export type WhitePopUpProps = {
  children?: React.ReactNode;
};

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Ensures the container takes up the full viewport height */
`;

const StyledWhitePopUp = styled.div`
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
  }
`;

const WhitePopUp: React.FC<WhitePopUpProps> = ({ children }) => {
  return (
    <PageContainer>
      <StyledWhitePopUp>{children}</StyledWhitePopUp>
    </PageContainer>
  );
};

export default WhitePopUp;
