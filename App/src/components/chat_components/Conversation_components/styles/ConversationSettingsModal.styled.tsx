import styled from "styled-components";

export const SettingsModalStyled = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1.5px);
`;

export const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column; /* Stack children vertically */
  
  width: 524px;

  padding: 10px;

  border: 1px solid #FFF;
  background: #000;
  position: relative;

  .header {
    display: flex;
	  justify-content: space-between;
    align-items: center;
    height: fit-content;
    padding: 1%;
    margin: 1%;

    font-size: 13px;

    img {
      padding-top: 0;
	    width: 25px;
      height: 25px;
      position: absolute;
      top: 7%;
      right: 3%;
    }
  
    h2
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2%; /* Add margin to separate the content from the header */
  margin-left: 8%;
  margin-bottom: 7%;

  .enable-section {
    display: flex;
    align-items: center;

    input[type="checkbox"] {
      margin-right: 10px;
    }
  }

  .description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    margin: 0; /* Remove any default margin */
    margin-top: -2%;
    margin-left: 35px;
  }
`;

export const Description = styled.p`
  font-size: 16px;
  margin-left: 10px;
  color: white;
`;