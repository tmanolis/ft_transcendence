import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import styled from "styled-components";
import JBRegular from "../assets/fonts/JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Regular.woff2";

type PageContainerProps = {
  children?: React.ReactNode;
};

const PageContainer = styled.div<PageContainerProps>`
  @font-face {
    font-family: "JetBrains Mono";
    src: url(${JBRegular}) format("woff2");
    font-weight: normal;
    font-style: normal;
  }
`;

const Authentification = () => {
  const [switchRegister, setSwitchRegister] = useState(false);

  const handleLink = () => {
    console.log("link clicked");
    setSwitchRegister(true);
  };

  return (
    <PageContainer>
      {switchRegister ? (
        <RegisterForm />
      ) : (
        <LoginForm onLinkClick={handleLink} />
      )}
    </PageContainer>
  );
};

export default Authentification;
