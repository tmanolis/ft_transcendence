import styled from "styled-components";

export const QRCodePopupWrapper = styled.div`
  position: fixed;
  width: 474px;
  height: 477px;
  left: 50%; /* Center horizontally */
  top: 50%; /* Center vertically */
  transform: translate(-50%, -50%); /* Centering trick */
  background: #000000;
  border: 2px solid #ffffff;
  display: flex;
  flex-direction: column; /* Align children vertically */
  align-items: center; /* Center horizontally */
  justify-content: center; /* Center vertically */
  text-align: center; /* Center text within the wrapper */
  z-index: 999; /* Make it appear in front of other elements */
`;

export const ChildContainer = styled.div`
  margin-top: 10px; /* Add margin between child elements */
`;

export const QRCodeContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
`;
