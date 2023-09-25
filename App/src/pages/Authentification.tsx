import React, { useState } from "react";
import LoginForm from "../components/auth_components/LoginForm";
import RegisterForm from "../components/auth_components/RegisterForm";
import styled from "styled-components";
import JBRegular from "../assets/fonts/JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Regular.woff2";
import { createPortal } from "react-dom";
import { Modal2FA } from "../components/auth_components/Modal2FA";

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
  const [switchRegister, setSwitchRegister] = useState<boolean>(false);
  const [modal2FAOpen, setModal2FAOpen] = useState(false);
  

  const handleLink = () => {
    setSwitchRegister(true);
  };

  const handleModal2FA = () => {
    setModal2FAOpen(true);
  }

  const handleButtonClick = () => {
    setModal2FAOpen(false);
  };

  return (
    <PageContainer>
      {switchRegister ? (
        <RegisterForm />
      ) : (
        <LoginForm onLinkClick={handleLink} openModal2FA={handleModal2FA}/>
      )}
      {modal2FAOpen &&
        createPortal(
          <Modal2FA onCancel={handleButtonClick}>
            <h2>2FA Authentification</h2>
          </Modal2FA>,
          document.body
        )}
    </PageContainer>
  );
};

export default Authentification;
