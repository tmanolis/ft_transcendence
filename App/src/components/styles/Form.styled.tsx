import styled from "styled-components";
import PSSBackground from "../../assets/PSSbackground.png"

export type FormProps = {
	children?: React.ReactNode;
	onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

export const StyledForm = styled.form`
	display: flex;
	place-items: center;
	flex-direction: column;
	align-items: center;
	width: 398px;
	border-radius: 8px;
	background-color: rgba(255, 255, 255, 0.8);
	box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.25);
	border: none;

	h1 {
		font-family: 'JetBrains Mono', monospace;
		color: #000000;
		font-style: normal;
		font-weight: 700;
		font-size: 30px;
		line-height: 70px;	
	};

	p {
		font-family: 'JetBrains Mono', monospace;
		color: #000000;
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 35px;	
	};
`
const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-image: url(${PSSBackground});
  background-size: cover;
  background-position: center;
`;


const Form: React.FC<FormProps> = ({ onSubmit, children }) => {
	return (
		<FormContainer>
			<StyledForm onSubmit={onSubmit}>{children}</StyledForm>;
		</FormContainer>
	)
}

export default Form;
