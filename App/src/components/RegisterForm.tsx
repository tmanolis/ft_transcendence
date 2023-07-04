import Button from "./styles/Button.styled"
import Form from "./styles/Form.styled"
import Input from "./styles/Input.styled"
import HoverText from "./styles/HoverText.styled"
import { useState } from "react";
import axios from "axios";


export default function RegisterForm() {
	const [userName, setUserName] = useState('');
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		const signupDTO = {
			userName: userName,
			email: email,
			password: pass,
		}

		try {
			const response = await axios.post(
				'http://localhost:3000/auth/local/signup',
				signupDTO
			);
			console.log('response', response);
		} catch (error) {
			console.log('error', error);
		}
	}

	return (
		<Form onSubmit={handleSubmit}>
			<h1>Sign Up</h1>
			<Input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="username" />
			<Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
			<Input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="password" />
			<HoverText>ⓘ requirements</HoverText>
			<Button type="submit">Create an account</Button>
		</Form>
	)
}
