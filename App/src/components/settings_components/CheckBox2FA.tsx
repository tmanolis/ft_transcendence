import axios from "axios";
import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3000";

const CheckBox2FA: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [QRCode, setQRCode] = useState("");
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/me`, {
          withCredentials: true,
        });
        console.log("response: " + response.data.twoFAActivated);
        setIsChecked(response.data.twoFAActivated);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckedValue = event.target.checked;
    
    setIsChecked(newCheckedValue);
    console.log("state: " + newCheckedValue);
    console.log("isChecked during handleCheckbox: " + isChecked);
    
    const updateDTO = {
      twoFAActivated: newCheckedValue
    };

    try {
      const response = await axios.patch(
        "http://localhost:3000/user/update",
        updateDTO,
        { withCredentials: true }
      );
      console.log(response.data);
      if (newCheckedValue) {
        setQRCode(response.data);
      }
    } catch (error) {
      console.error(error);;
    }

  };

  // useEffect(() => {
  //   console.log("isChecked: " + isChecked);
  // }, [isChecked]);

  return (
    <>
      <input type="checkbox"
      id="2fa_checkbox"
      checked={isChecked}
      onChange={handleCheckboxChange} 
      />
      <label htmlFor="2fa_checkbox">enable_2fa</label>
      <p>double factor authentification for maximum security</p>
      {QRCode && (
        <div className="popup">
          <h3>Scan QRCode</h3>
          <img src={QRCode} alt="QRCode img" />
        </div>
      )}
    </>
  );
};

export default CheckBox2FA;
