import React from "react";
import CheckBoxSettings from "./CheckBoxSettings";

const EditInfosForm: React.FC = () => {

	return (
		<form className="settings_form">
			<CheckBoxSettings />
			<div className="edit_username">
				<input type ="text" id="new_nickname" placeholder="new nickname"/>
				<button className="basic_btn">Confirm</button>
			</div>
			<div className="edit_username">
				<input type ="text" id="old_password" placeholder="old password"/>
				<input type ="text" id="new_password" placeholder="new password"/>
				<button className="basic_btn">Confirm</button>
			</div>
		</form>
	);
};

export default EditInfosForm;