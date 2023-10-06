import styled from "styled-components";

export const UsersListModalStyled = styled.div`
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
  z-index: 999;
`;

export const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column; /* Stack children vertically */
  
  width: 524px;

  padding: 10px;

  border: 1px solid #FFF;
  background: #000;
  position: relative;

  @media screen and (max-width: 500px) {
    overflow: scroll;
	}
`;

export const Head = styled.div`
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
    top: 6%;
    right: 3%;
  }
`;

export const UsersList = styled.div`
  display: flex;
  width: 456px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow-y: scroll;
  max-height: 300px;
`;