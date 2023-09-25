import React, { useState } from "react";

import "./styles/Modal2FA.styled.css";
import InputSettings from "../settings_components/styles/InputSettings.styled";
import axios, { AxiosError } from "axios";
import ConfirmButton from "../settings_components/styles/ConfirmButton.styled";

interface Modal2FAProps {
	onCancel: () => void;
	children: React.ReactNode;
  }
  
  export const Modal2FA: React.FC<Modal2FAProps> = ({ onCancel,  children }) => {
	const [inputValue, setInputValue] = useState("");
  	const [errorResponse, setErrorResponse] = useState("");

	  const handleConfirmClick = async () => {

		console.log("inputValue: " + inputValue);
		const updateDTO = {
		  code: inputValue,
		  nonce: "prout"
		};
	
		try {
		  const response = await axios.post(
			"http://localhost:3000/auth/2fa-verify",
			updateDTO,
			{ withCredentials: true }
		  );
		  console.log(response);
		  window.location.reload();
		  
		} catch (error) {
		  handleUpdateError(error as AxiosError);
		}
	  };
	
	  const handleUpdateError = (error: AxiosError) => {
		console.log(error.response)
		if (error.response) {
			setErrorResponse("2FA failed. Please try again!");
			setInputValue("");
		};
	  };

	return (
		<div className="modal-container">
		<div className="modal">
			<div className="modal-content">
				{children}
				<InputSettings
				type="text"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)} // Update inputValue
				placeholder="<Enter code>"
				// style={{ border: "1px solid #fff", borderRadius: "5px", color: "white", margin: "3px" }}
				/>
				{errorResponse && (
				<div style={{ color: "red", fontSize: "12px" }}>{errorResponse}</div>)}
			</div>
			<div className="modal-footer">
			<ConfirmButton type="button" onClick={onCancel}>Cancel</ConfirmButton>
        	<ConfirmButton type="submit" onClick={handleConfirmClick}>Confirm</ConfirmButton>
			</div>
		</div>
		</div>
	);
};