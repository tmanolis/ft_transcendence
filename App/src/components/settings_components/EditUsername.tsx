import axios, { AxiosError } from "axios";
import React from "react";

const EditUsername: React.FC = () => {
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;;
		const formData = new FormData(form);
		const new_username = formData.get("new_username");

		form.reset();

		const updateDTO = {
		  userName: new_username,
		};

		try {
			const response = await axios.patch("http://localhost:3000/user/update",
			updateDTO,
			{ withCredentials: true });
			console.log(response);
		  } catch (error) {
			  console.log(error as AxiosError);
		  }
	}

	return (
		<>
		<form onSubmit={handleSubmit}>
			<input
				name = "new_username"
				type ="text"
				id="new_username" 
				placeholder="new username"
			/>
			<button type="submit">Confirm</button>
			{/* <ConfirmButton type="submit">Confirm</ConfirmButton> */}
		</form>
		</>
	);
};

export default EditUsername

// import React, { useState } from "react";
// import axios from "axios";
// import axios, { AxiosError } from "axios";
// import ConfirmButton from "./styles/ConfirmButton.styled";

// interface FormEvent extends React.FormEvent<HTMLFormElement> {}

// const handleSubmit = async (e: React.FormEvent) => {
// 	e.preventDefault();

// 	const signupDTO = {
// 	  userName: newUsername,
// 	};

	// try {
	//   const response = await axios.patch(
	// 	"http://localhost:3000/user/update",
	// 	signupDTO,
	// 	{ withCredentials: true }
	//   );
	//   console.log(response);
	// } catch (error) {
	// 	console.log(error);
	// }
//   };