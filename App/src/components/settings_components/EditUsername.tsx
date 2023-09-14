import React, { useState } from "react";

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
			<button type="submit" className="basic_btn">Confirm</button>
		</form>
		</>
	);
};

export default EditUsername