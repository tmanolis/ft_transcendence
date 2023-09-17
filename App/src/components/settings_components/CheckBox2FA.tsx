import React from "react";

const CheckBox2FA: React.FC = () => {

	return (
		<>
			<input type ="checkbox" id="2fa_checkbox" />
			<label htmlFor="2fa_checkbox">enable_2fa</label>
			<p>double factor authentification for maximum security</p>
		</>
	);
};

export default CheckBox2FA