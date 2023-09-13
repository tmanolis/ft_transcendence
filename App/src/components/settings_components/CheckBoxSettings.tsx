import React from "react";

const CheckBoxSettings: React.FC = () => {

	return (
		<>
		<input type ="checkbox" id="2fa_checkbox" />
		<label htmlFor="2fa_checkbox">enable_2fa</label>
		<p>Manage your informations and security</p>
		</>
	);
};

export default CheckBoxSettings