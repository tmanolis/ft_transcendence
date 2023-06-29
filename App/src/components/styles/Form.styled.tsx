import styled from "styled-components";

export type FormProps = {
	children?: React.ReactNode;
}

export const StyledForm = styled.div`
	display: flex;
	place-items: center;
	flex-direction: column;
	align-items: center;
	width: 398px;
	height: 521px;
	border-radius: 10px;
	background-color: rgba(255, 255, 255, 0.8);
	font-family: 'JetBrains Mono', monospace;
	color: black;
	border: none;
`

const Form: React.FC<FormProps> = ({children}) => {
	return <StyledForm>{children}</StyledForm>;
}

export default Form;
