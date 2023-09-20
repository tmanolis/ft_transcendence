import React, { useState } from 'react'; // Import useState
import { QRCodePopupWrapper, QRCodeContainer, ChildContainer } from './styles/QRCodePopUp.styled';
import ConfirmButton from './styles/ConfirmButton.styled';

interface QRCodePopupProps {
  QRCode: string;
}

const QRCodePopup: React.FC<QRCodePopupProps> = ({ QRCode }) => {
  const [inputValue, setInputValue] = useState(""); // State to hold input value

  const handleCancelClick = () => {
    window.location.reload();
  };

  const handleConfirmClick = () => {
    console.log('Confirmed with input:', inputValue);
    // request post to verify 2FA
  };

  return (
    <QRCodePopupWrapper>
        <h3>Scan QR Code to follow 2FA Authentification</h3>
      <QRCodeContainer>
        <img src={QRCode} alt="QRCode img" />
      </QRCodeContainer>
      <ChildContainer>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Update inputValue
          placeholder="Enter code"
        />
      </ChildContainer>
      <ChildContainer>
        <ConfirmButton type="button" onClick={handleCancelClick}>Cancel</ConfirmButton>
        <ConfirmButton type="submit" onClick={handleConfirmClick}>Confirm</ConfirmButton>
      </ChildContainer>
    </QRCodePopupWrapper>
  );
};

export default QRCodePopup;
