import React from 'react';
import { QRCodePopupWrapper, QRCodeContainer } from './styles/QRCodePopUp.styled'; // Import the styled-components
import ConfirmButton from './styles/ConfirmButton.styled';

interface QRCodePopupProps {
  QRCode: string;
}

const QRCodePopup: React.FC<QRCodePopupProps> = ({ QRCode }) => {
  return (
    <QRCodePopupWrapper>
    	<h3>Scan QRCode</h3>
		<QRCodeContainer>
			<img src={QRCode} alt="QRCode img" />
		</QRCodeContainer>
    <button>Cancel</button>
    <ConfirmButton type="submit">Confirm</ConfirmButton>
    </QRCodePopupWrapper>
  );
};

export default QRCodePopup;