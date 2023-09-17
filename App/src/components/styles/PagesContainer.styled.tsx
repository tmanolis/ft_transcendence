import React from "react";
import styled from "styled-components";

export type PagesContProps = {
  children?: React.ReactNode;
};

const PageContainerStyled = styled.div`
    display: flex;
    align-items: flex-start;
`;

const PageContainer: React.FC<PagesContProps> = ({ children }) => {
  return (
    <PageContainerStyled>
        {children}
    </PageContainerStyled>
  );
};

export default PageContainer;
