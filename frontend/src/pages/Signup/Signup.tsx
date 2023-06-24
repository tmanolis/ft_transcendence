import { useRef, useEffect, useState } from "react";

const Signup = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const userName = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    alert(`username: ${userName}, email: ${email}, hash: ${password}`);

    const formData = { userName: userName, email: email, password: password };

    var formBody = [];
    for (var property in formData) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(formData[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    console.log(formBody);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody,
    };

    const res = await fetch('http://localhost:3000/auth/local/signup', requestOptions)
    console.log(res);
    const data = await res.json();
  }

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <br />
          <label>Username
            <input type="text" name="username" />
          </label>
          <br />
          <br />
          <label>Email
            <input type="text" name="email" />
          </label>
          <br />
          <br />
          <label>Password:
            <input type="text" name="password" />
          </label>
          <br />
          <br />
          <input type="submit" value="Login" />
        </form>
      </div>
    </>
  )
};

export default Signup;
