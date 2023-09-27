import React from "react";
import { styled } from "styled-components";

export type PageProps = {
  children?: React.ReactNode;
};

const StyledPageContainer = styled.div`
  h1,
  p {
    color: white;
    font-family: "JetBrains Mono", monospace;
  }

  background: black;
  align-items: center;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  position: fixed;
  width: 100%;
`;

const PageContainer: React.FC<PageProps> = ({ children }) => {
  return <StyledPageContainer>{children}</StyledPageContainer>;
};

export default PageContainer;
