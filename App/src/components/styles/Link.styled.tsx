import styled from 'styled-components';
import React from 'react';

const StyledLink = styled.button<{}>`
	background: none;
	color: #766e6e;
	align-items: right;
	font-family: 'JetBrains Mono', monospace;
	font-size: 75%;
	width: 100%;
	border: none;
	text-align: right;
`;

const Link: React.FunctionComponent<{}> = (props) => {
  return <StyledLink {...props} />;
};

export default Link;