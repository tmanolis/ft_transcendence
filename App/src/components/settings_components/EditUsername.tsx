import React, { useState } from "react";
import ConfirmButton from "./styles/ConfirmButton.styled";

interface FormEvent extends React.FormEvent<HTMLFormElement> {}

const EditUsername: React.FC = () => {

	const [newUsername, setnewUsername] = useState("");
	
	function handleSubmit(e: FormEvent) {
		e.preventDefault();

		setnewUsername("");
	}

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