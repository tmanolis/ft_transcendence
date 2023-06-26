import React, { useState } from "react";

export const Register = (props) => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState(''); 
	const [pass, setPass] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(email, username, pass);
	}

	return(
		<div className="App">
			<div className="auth-form-container">
				<h2>Sign Up</h2>
				<form className="register-form" onSubmit={handleSubmit}>
					<input value={username} type="username" placeholder="Username" id="username" name="username" />
					<input value={email} type="email" placeholder="Email" id="email" name="email" />
					<input value={pass} type="password" placeholder="Password" id="password" name="password" />
					<button className="link-button" onClick={() => props.onFormSwitch('login')}>Already have an account? Log in here</button>
					<button type="submit">Sign up</button>
				</form>
			</div>
		</div>
	)
}