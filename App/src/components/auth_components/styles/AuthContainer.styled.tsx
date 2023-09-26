import React from "react";
import { styled } from "styled-components";
import JBRegular from "../../../assets/fonts/JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Regular.woff2";

export type PageProps = {
  children?: React.ReactNode;
};

const StyledPageContainer = styled.div`
  @font-face {
    font-family: "JetBrains Mono";
    src: url(${JBRegular}) format("woff2");
    font-weight: normal;
    font-style: normal;
  }

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
