import styled from 'styled-components';
import React, { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const StyledInput = styled.input<{}>`
	background: rgba(0, 0, 0, 0.26);
	color: rgba(250, 242, 242, 0.8);
	border-radius: 3px;
	border: none;

	width: 360px;
	height: 47px;
	margin: 1rem;

	font-family: 'JetBrains Mono';
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	line-height: 35px;
	text-indent: 16px;

&::placeholder {
	color: rgba(250, 242, 242, 0.8);
}

&:focus {
		outline: none;
		box-shadow: none;
    transform: none;
    transition: none;
		color: white;
  }
`;

const Input: React.FC<InputProps> = (props) => {
  return <StyledInput {...props} />;
};

export default Input;