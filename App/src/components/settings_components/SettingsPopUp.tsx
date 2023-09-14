import React from "react";
import EditInfosForm from "./EditInfosForm";
import EditAvatar from "./EditAvatar";
import WhitePopUp from "./styles/WhitePopUp";

const SettingsPopUp: React.FC = () => {

	return (
		<WhitePopUp>
			<h2>Settings</h2>
			<h3>Manage your informations and security</h3>
			<EditAvatar />
			<EditInfosForm />
		</WhitePopUp>
	);
};

export default SettingsPopUp;