import React from "react";
import styled from "styled-components";

export type LandContProps = {
  children?: React.ReactNode;
};

const LandingContainerStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 20px;
`;
const LandingContainer: React.FC<LandContProps> = ({ children }) => {
  return <LandingContainerStyled>{children}</LandingContainerStyled>;
};

export default LandingContainer;
