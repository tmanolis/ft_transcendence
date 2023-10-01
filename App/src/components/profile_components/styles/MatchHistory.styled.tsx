import styled from "styled-components";

export const MatchHistoryStyled = styled.div`
	width: 317px;
    height: 417px;
    border: 1px solid #FFF;
    background: #000;
    box-shadow: 1px 2px 1px 0px rgba(255, 255, 255, 0.90);

	h1{
        margin: 0;
        padding-left: 5%;
        color: #FFF;
        font-size: 20px;
        font-style: normal;
        font-weight: 500;
        line-height: 70px; /* 350% */
        letter-spacing: 0.4px;
	}
`;

export const HistoryScrollingList = styled.div`
  width: 100%;
  height: 80%;
  overflow-y: auto; /* Add a vertical scrollbar when content overflows */
  padding: 5px; /* Add some padding to keep content away from the container edges */
  box-sizing: border-box; /* Ensure padding is included in the container's dimensions */

  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #555;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const MatchElement = styled.div`
  width: 95%;
  height: 13%;
  flex-shrink: 0;
  border-top: 1px solid #FFF;
  border-left: 1px solid #FFF;
  background: #000;
  box-shadow: 2px 2px 0px 0px rgba(157, 157, 157, 0.25);
  margin-bottom: 5px; /* Add margin to separate MatchElement components */
`;

