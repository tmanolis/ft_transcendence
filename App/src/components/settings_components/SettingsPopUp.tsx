import React from "react";
import WhitePopUp from "./styles/WhitePopUp";
import EditAvatar from "./EditAvatar";
import CheckBox2FA from "./CheckBox2FA";
import EditUsername from "./EditUsername";
import EditPassword from "./EditPassword";

const SettingsPopUp: React.FC = () => {

	return (
		<WhitePopUp>
			<h2>Settings</h2>
			<h3>Manage your informations and security</h3>
			<EditAvatar />
			<CheckBox2FA />
			<EditUsername />
			<EditPassword />
		</WhitePopUp>
	);
};

export default SettingsPopUp;