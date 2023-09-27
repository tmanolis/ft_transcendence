import { InputHTMLAttributes } from "react";
import styled from "styled-components";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const InputContainer = styled.div`
  margin: 3px;
  display: flex;
  gap: 10px; /* Add space between the input and button */
  align-items: flex-end; /* Align items at the bottom */
  margin-top: 15px;
  margin-bottom: 15px;
`;

const StyledInputSettings = styled.input`
  border: 1px solid #000;
  background: rgba(62, 62, 62, 0);
  color: rgba(0, 0, 0, 0.8);
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 35px;
  width: 212px;
  height: 25px;
  text-align: center; /* Center the text horizontally */
`;

function InputSettings(props: InputProps) {
  return <StyledInputSettings {...props} />;
}

export default InputSettings;
