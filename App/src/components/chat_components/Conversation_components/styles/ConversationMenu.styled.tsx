import styled from "styled-components";

export const ChanMenuBar = styled.div`
  width: 206px;
  height: 214px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2px solid #FFF;
  background: #000;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1;
  /* Hover styles */
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
`;

export const ChanMenuElement = styled.button`
  display: flex;
  width: 100%; /* Full-width button */
  height: calc(100% / 3); /* Divide the height into 3 equal parts */
  flex-direction: column;
  justify-content: center;
  align-items: center; /* Center horizontally and vertically */
  flex-shrink: 0;
  background: #000; /* Full black background */
  border: none; /* Remove button border */
  font-size: 19px;
  font-style: normal;
  letter-spacing: 0.5px;
  color: #FFF; /* Text color */

  &:hover {
    background: #FFF; /* White background on hover */
    color: #000; /* Black text on hover */
  }

  &:not(:last-child) {
    border-bottom: 1px solid #888; /* Grey line as a bottom border between buttons */
  }

  cursor: pointer; /* Ensure the button remains clickable */
`;

export const RedTextButton = styled(ChanMenuElement)`
  color: red; /* Set the text color to red */
`;