import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import ConfirmButton from "./styles/ConfirmButton.styled";

const EditPassword: React.FC = () => {
	const [updateError, setUpdateError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setUpdateError("");

		const form = e.target as HTMLFormElement;;
		const formData = new FormData(form);
		const old_password = formData.get("old_password");
		const new_password = formData.get("new_password");

		form.reset();

		const updateDTO = {
		  oldPassword: old_password,
		  password: new_password
		};

		try {
			const response = await axios.patch("http://localhost:3000/user/update",
			updateDTO,
			{ withCredentials: true });
			console.log(response);
		  } catch (error) {
			console.log(error as AxiosError);
			handleUpdateError(error as AxiosError);
		  }
	}

	const handleUpdateError = (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 400) {
        setUpdateError("Old password or new password is incorrect");
      }
    } else {
      setUpdateError("Network error occured");
    }
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<input
					name = "old_password"
					type ="text"
					id="old_password" 
					placeholder="old password"
				/>
				<input
					name = "new_password"
					type ="text"
					id="new_password" 
					placeholder="new password"
				/>
				<ConfirmButton type="submit">Confirm</ConfirmButton>
			</form>
			{updateError && <div style={{ color: 'red', fontSize: '12px' }}>{updateError}</div>}
		</>
	);
};

export default EditPassword;