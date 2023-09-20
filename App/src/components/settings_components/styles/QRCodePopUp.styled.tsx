import styled from 'styled-components';


export const QRCodePopupWrapper = styled.div`
  position: fixed;
  width: 474px;
  height: 477px;
  left: 50%; /* Center horizontally */
  top: 50%; /* Center vertically */
  transform: translate(-50%, -50%); /* Centering trick */
  background: #000000;
  border: 2px solid #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999; /* Make it appear in front of other elements */
`;

export const QRCodeContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
`;