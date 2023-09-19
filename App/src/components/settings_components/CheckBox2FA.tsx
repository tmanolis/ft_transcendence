import axios from "axios";
import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3000";

const CheckBox2FA: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  
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
    setIsChecked(event.target.checked);
    console.log("state: " + event.target.checked);
    
    const updateDTO = {
      twoFAActivated: event.target.checked
    };

    try {
      const response = await axios.patch(
        "http://localhost:3000/user/update",
        updateDTO,
        { withCredentials: true }
      );
      console.log(response);
    } catch (error) {
      console.error(error);;
    }

  };

  return (
    <>
      <input type="checkbox"
      id="2fa_checkbox"
      checked={isChecked}
      onChange={handleCheckboxChange} 
      />
      <label htmlFor="2fa_checkbox">enable_2fa</label>
      <p>double factor authentification for maximum security</p>
    </>
  );
};

export default CheckBox2FA;
