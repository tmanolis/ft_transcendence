import React, { useState } from "react";
import WhitePopUp from "./styles/WhitePopUp";
import EditAvatar from "./EditAvatar";
import CheckBox2FA from "./CheckBox2FA";
import EditUsername from "./EditUsername";
import EditPassword from "./EditPassword";
import QRCodePopup from "./QRcodePopUp";
import styled from "styled-components";

const SettingsContainer = styled.div`
box-sizing: border-box;
/* position: absolute; */
left: 3.52%;
right: 3.27%;
top: 37.04%;
bottom: 2.5%;

border: 1px solid #000000;

`;

const SettingsPopUp: React.FC = () => {
  const [QRCode, setQRCode] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  
  const handleQRcode = (path: string) => {
    setQRCode(path);
  };
  // Function to handle errors and update updateError state
  const handleUpdateError = (error: string) => {
    setUpdateError(error);
  };
  // Function to handle success and update updateSuccess state
  const handleUpdateSuccess = (success: string) => {
    setUpdateSuccess(success);
  };

  return (
    <>
    {QRCode && <QRCodePopup QRCode={QRCode} />}
    <WhitePopUp>
      <h2>Settings</h2>
      <h3>Manage your informations and security</h3>
      <EditAvatar />
      {/* <SettingsContainer> */}
      <CheckBox2FA QRcode={handleQRcode} />
      <EditUsername onError={handleUpdateError} />
      <EditPassword
        onError={handleUpdateError}
        onSuccess={handleUpdateSuccess}
      />
      {updateSuccess && (
        <div style={{ color: "green", fontSize: "12px" }}>{updateSuccess}</div>
      )}
      {updateError && (
        <div style={{ color: "red", fontSize: "12px" }}>{updateError}</div>
      )}
      {/* </SettingsContainer> */}
    </WhitePopUp>
    </>
  );
};

export default SettingsPopUp;
