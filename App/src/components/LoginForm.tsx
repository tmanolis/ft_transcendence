import Button from "./styles/Button.styled";
import Form from "./styles/Form.styled";
import Input from "./styles/Input.styled";
import LinkButton from "./styles/LinkButton.styled";

export type LoginFormProps = {
	onLinkClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLinkClick }) => {
	return (
		<Form>
			<h1>Connect</h1>
			<Button>Sign up with 42</Button>
			<p>――――― OR ――――― </p>
			<Input placeholder="email"/>
			<Input placeholder="password"/>
			<LinkButton onClick={onLinkClick}>Don't have an account? Sign up here.</LinkButton>
			<Button>Log In</Button>
		</Form>
	)
}

export default LoginForm;