import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import ConfirmButton from "./styles/ConfirmButton.styled";

interface FormEvent extends React.FormEvent<HTMLFormElement> {}

const EditUsername: React.FC = () => {

	const [newUsername, setnewUsername] = useState("");
	const [loginError, setLoginError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
	
		const signupDTO = {
		  userName: newUsername,
		};
	
		try {
		  const response = await axios.patch(
			"http://localhost:3000/user/update",
			signupDTO,
		  );
		  console.log(response);
		} catch (error) {
		//   handleLoginError(error as AxiosError);
		}
	  };

	//   const handleLoginError = (error: AxiosError) => {
	// 	if (error.response) {
	// 	  const status = error.response.status;
	// 	  if (status === 403) {
	// 		setLoginError("Username or email already in use");
	// 	  }
	// 	} else {
	// 	  setLoginError("Network error occured");
	// 	}
	//   };

	return (
		<>
		<form onSubmit={handleSubmit}>
			<input
				value={newUsername}
				onChange={e => setnewUsername(e.target.value)} 
				type ="text" id="new_nickname" 
				placeholder="new nickname"
			/>
			<button className="basic_btn">Confirm</button>
			{/* <ConfirmButton type="submit">Confirm</ConfirmButton> */}
		</form>
		</>
	);
};

export default EditUsername