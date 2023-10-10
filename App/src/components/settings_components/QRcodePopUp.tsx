import React, { useState } from "react"; // Import useState
import {
  QRCodePopupWrapper,
  QRCodeContainer,
  ChildContainer,
} from "./styles/QRCodePopUp.styled";
import ConfirmButton from "./styles/ConfirmButton.styled";
import axios, { AxiosError } from "axios";
import InputSettings from "./styles/InputSettings.styled";

interface QRCodePopupProps {
  QRCode: string;
}

const QRCodePopup: React.FC<QRCodePopupProps> = ({ QRCode}) => {
  const [inputValue, setInputValue] = useState("");
  const [errorResponse, setErrorResponse] = useState("");

  const handleCancelClick = () => {
    window.location.reload();
  };

  const handleConfirmClick = async () => {
    console.log("inputValue: " + inputValue);
    const updateDTO = {
      code: inputValue,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/2fa-enable`,
        updateDTO,
        { withCredentials: true },
      );
      console.log(response);
      window.location.reload();
    } catch (error) {
      handleUpdateError(error as AxiosError);
    }
  };

  const handleUpdateError = (error: AxiosError) => {
    console.log(error.response);
    if (error.response) {
      setErrorResponse("2FA failed. Please try again!");
      setInputValue("");
    }
  };

  return (
    <QRCodePopupWrapper>
      <h3>Scan QR Code to follow 2FA Authentification</h3>
      <QRCodeContainer>
        <img src={QRCode} alt="QRCode img" />
      </QRCodeContainer>
      <ChildContainer>
        <InputSettings
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Update inputValue
          placeholder="<Enter code>"
          style={{
            border: "1px solid #fff",
            borderRadius: "5px",
            color: "white",
            margin: "3px",
          }}
        />
        {errorResponse && (
          <div style={{ color: "red", fontSize: "12px" }}>{errorResponse}</div>
        )}
      </ChildContainer>
      <ChildContainer>
        <ConfirmButton type="button" onClick={handleCancelClick}>
          Cancel
        </ConfirmButton>
        <ConfirmButton type="submit" onClick={handleConfirmClick}>
          Confirm
        </ConfirmButton>
      </ChildContainer>
    </QRCodePopupWrapper>
  );
};

export default QRCodePopup;
