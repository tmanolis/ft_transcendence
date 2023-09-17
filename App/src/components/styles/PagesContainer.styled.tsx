import React from "react";
import styled from "styled-components";

export type PagesContProps = {
  children?: React.ReactNode;
  type?: "settings" | "other";
};

const PageContainerStyled = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PopUpPage = styled.div`
    width: 960px;
    height: 642px;
    flex-shrink: 0;
    border: 1px solid #FFF;
    background: #000;
    box-shadow: 1px 5px 1px 0px #FFF;
`;

const PageContainer: React.FC<PagesContProps> = ({ children, type }) => {
  return (
    <PageContainerStyled>
        {type === "other" ? (
            <PopUpPage>{children}</PopUpPage>
        ) : (
            children
        )}
    </PageContainerStyled>
  );
};

export default PageContainer;