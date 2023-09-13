import React from "react";
import EditInfosForm from "./EditInfosForm";
// import EditAvatar from "./EditAvatar";

const SettingsPopUp: React.FC = () => {

	return (
		<div className="Settings">
			<h2>Settings</h2>
			<h3>Manage your informations and security</h3>
			{/* <EditAvatar /> */}
			<EditInfosForm />
			<h1>LOL</h1>
		</div>
	);
};

export default SettingsPopUp;