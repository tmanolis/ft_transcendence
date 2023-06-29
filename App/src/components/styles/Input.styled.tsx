import styled from 'styled-components';
import React, { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const StyledInput = styled.input<{}>`
	margin: 0.75rem;
	padding: 1rem;
	border: none;
	border-radius: 5px;
	background-color: #a49d9d;
	color: white;
	font-family: 'JetBrains Mono', monospace;
	width: 300px;
`;

const Input: React.FC<InputProps> = (props) => {
  return <StyledInput {...props} />;
};

export default Input;