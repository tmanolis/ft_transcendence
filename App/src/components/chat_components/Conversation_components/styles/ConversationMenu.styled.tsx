import styled from "styled-components";

interface ChanMenuBarProps {
  $isOwner: boolean;
}

export const ChanMenuBar = styled.div<ChanMenuBarProps>`
  width: 206px;
  height: ${(props) => (props.$isOwner ? "214px" : "150px")}; /* Adjust height as needed */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2px solid #FFF;
  background: #000;
  position: absolute;
  top: 48%;
  right: 6.5%;
  z-index: 1;
  /* Hover styles */
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
`;

export const ChanMenuElement = styled.button`
  display: flex;
  width: 100%;
  flex-grow: 1; /* Use flex-grow to equally share the height */
  flex-shrink: 0;
  flex-basis: 0;
  padding-left: 5%;
  justify-content: left;
  align-items: center;
  background: #000;
  border: none;
  font-size: 19px;
  font-weight: bold;
  font-style: normal;
  letter-spacing: 0.5px;
  color: #FFF;

  &:hover {
    background: #FFF;
    color: #000;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #888; /* Grey line as a bottom border between buttons */
  }

  cursor: pointer; /* Ensure the button remains clickable */
`;

export const RedTextButton = styled(ChanMenuElement)`
  color: red; /* Set the text color to red */
`;