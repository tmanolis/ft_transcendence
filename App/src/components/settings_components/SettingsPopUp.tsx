import React from "react";
import EditInfosForm from "./EditInfosForm";

const SettingsPopUp: React.FC = () => {

	return (
		<div className="Settings">
			<h2>Settings</h2>
			<h3>Manage your informations and security</h3>
			<EditInfosForm />
		</div>
	);
};

export default SettingsPopUp;