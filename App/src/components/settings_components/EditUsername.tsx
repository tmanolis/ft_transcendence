import React, { useState } from "react";

const EditUsername: React.FC = () => {

	const [newUsername, setnewUsername] = useState("");
	return (
		<>
			<input
				value={newUsername}
				onChange={e => setnewUsername(e.target.value)} 
				type ="text" id="new_nickname" 
				placeholder="new nickname"
			/>
			<button className="basic_btn">Confirm</button>
		</>
	);
};

export default EditUsername