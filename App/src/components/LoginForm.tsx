import React, {useState } from "react";
import Button from "./styles/Button.styled";
import Form from "./styles/Form.styled";
import Input from "./styles/Input.styled";
import LinkButton from "./styles/LinkButton.styled";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router";
// import fourtyTwoLogo from "../assets/42_logo";

export type LoginFormProps = {
	onLinkClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLinkClick }) => {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const [loginError, setLoginError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const loginDTO = {
			email: email,
			password: pass,
		}

		try {
			const response = await axios.post(
				'http://localhost:3000/auth/local/login',
				loginDTO
			);
			console.log(response);
			navigate("/pong");
			console.log('response other', response);
			// Logging response for now, should redirect when React routing is implemented
		} catch (error) {
			handleLoginError(error as AxiosError);
		}
	}

	const handleLoginError = (error: AxiosError) => {
		if (error.response) {
			const status = error.response.status;
			if (status === 400) {
				setLoginError("Invalid email or password format");
			} else if (status === 403) {
				setLoginError("User not found");
			} else {
				setLoginError("Login failed");
			}
		} else {
			setLoginError("Network error occured");
		}
	}

	const handleFourtyTwo = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		
		// 42 login callback URI is not working - should fix that before finishing this method
		try {
			const response = await axios.get(
				'http://localhost:3000/auth/fourtytwo/login'
			);
			console.log('response 42', response)
		} catch (error) {
			console.log('error 42', error);
		}
	}

	return (
		<Form onSubmit={handleSubmit} loginError={loginError}>
			<h1>Connect</h1>
			<Button type="button" onClick={handleFourtyTwo}>Sign up with 42</Button>
			<p>――――― OR ――――― </p>
			<Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email"/>
			<Input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="password"/>
			<LinkButton onClick={onLinkClick}>Don't have an account? Sign up here.</LinkButton>
			<Button type="submit">Log In</Button>
		</Form>
	)
}

export default LoginForm;