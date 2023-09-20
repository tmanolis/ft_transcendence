import React, { useState } from 'react'; // Import useState
import { QRCodePopupWrapper, QRCodeContainer } from './styles/QRCodePopUp.styled';
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
      <h3>Scan QRCode</h3>
      <QRCodeContainer>
        <img src={QRCode} alt="QRCode img" />
      </QRCodeContainer>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)} // Update inputValue
        placeholder="Enter code"
      />
      <button onClick={handleCancelClick}>Cancel</button>
      <ConfirmButton type="submit" onClick={handleConfirmClick}>Confirm</ConfirmButton>
    </QRCodePopupWrapper>
  );
};

export default QRCodePopup;
