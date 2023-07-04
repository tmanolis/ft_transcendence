import React, {useState} from "react";
import Button from "./styles/Button.styled";
import Form from "./styles/Form.styled";
import Input from "./styles/Input.styled";
import LinkButton from "./styles/LinkButton.styled";

export type LoginFormProps = {
	onLinkClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLinkClick }) => {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');

	const handleSubmit= (e: React.FormEvent, fourtytwo: boolean) => {
		e.preventDefault();
		if (fourtytwo){
			console.log('42', email, pass);
			// @GET /auth/fourtytwo/login
		}
		else{
			console.log('local', email, pass);
			// @POST /auth/local/login
		}
	}

	return (
		<Form>
			<h1>Connect</h1>
			<Button onClick={(e) => handleSubmit(e, true)}>Sign up with 42</Button>
			<p>――――― OR ――――― </p>
			<Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email"/>
			<Input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="password"/>
			<LinkButton onClick={onLinkClick}>Don't have an account? Sign up here.</LinkButton>
			<Button onClick={(e) => handleSubmit(e, false)}>Log In</Button>
		</Form>
	)
}

export default LoginForm;