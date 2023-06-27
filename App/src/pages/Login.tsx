import React, { useState, FormEvent } from "react";

// interface LoginProps {
//   onFormSwitch: (formName: 'login' | 'register') => void;
// }

export const Login: React.FC<LoginProps> = (props) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, pass);
  }

  return (
    <div className="App">
      <div className="auth-form-container">
        <h2>Connect</h2>
        <button type="submit">
          Sign in with <img src={require('../assets/42_logo.png')} alt="42" style={{ width: '23px', height: '16px' }} />
        </button>
        <div className="separator"> ―――――&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;――――― </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input value={email} type="email" placeholder="Email" id="email" name="email" />
          <input value={pass} type="password" placeholder="Password" id="password" name="password" />
          {/* <button className="link-button" onClick={() => props.onFormSwitch('register')}>Don't have an account yet? Register here</button> */}
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}
