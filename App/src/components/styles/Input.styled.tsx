import styled from 'styled-components';
import React from 'react';

const StyledInput = styled.input<{}>`
	margin: 0.75rem;
	padding: 1rem;
	border: none;
	border-radius: 5px;
	background-color: darkgrey;
	color: white;
	font-family: 'JetBrains Mono', monospace;
	width: 300px;
`;

const Input: React.FunctionComponent<{}> = (props) => {
  return <StyledInput {...props} />;
};

export default Input;