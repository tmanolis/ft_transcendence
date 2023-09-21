import { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const InputContainer = styled.div`
margin: 3px;
display: flex;
gap: 10px; /* Add space between the input and button */
align-items: flex-end; /* Align items at the bottom */
`;

const StyledInputSettings = styled.input`
border: 1px solid #000;
background: rgba(62, 62, 62, 0.00);
color: rgba(0, 0, 0, 0.80);
font-family: JetBrains Mono;
font-size: 15px;
font-style: normal;
font-weight: 500;
line-height: 35px;
width: 212px;
height: 28px;
padding: 5px;
text-align: center; /* Center the text horizontally */
`;

function InputSettings(props: InputProps) {
  return <StyledInputSettings {...props} />;
}

export default InputSettings;
