import styled from 'styled-components';
import React from 'react';

const StyledButton = styled.button<{}>`
	border: none;
	background-color: black;
	color: white;
	padding: 1rem;
	border-radius: 5px;
	font-family: 'JetBrains Mono', monospace;
	width: 200px;
	margin: 1.5rem auto;
`;

const Button: React.FunctionComponent<{}> = (props) => {
  return <StyledButton {...props} />;
};

export default Button;