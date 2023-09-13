import React from "react";
import EditInfosForm from "./EditInfosForm";
import EditAvatar from "./EditAvatar";

const SettingsPopUp: React.FC = () => {

	return (
		<div className="Settings">
			<h2>Settings</h2>
			<h3>Manage your informations and security</h3>
			<EditAvatar />
			<EditInfosForm />
		</div>
	);
};

export default SettingsPopUp;