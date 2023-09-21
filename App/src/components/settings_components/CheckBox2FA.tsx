import axios from "axios";
import React, { useEffect, useState } from "react";
import { CheckBoxWrapper } from "./styles/CheckBox2FA.styled";

const BASE_URL = "http://localhost:3000";

interface CheckBox2FAProps {
  QRcode: (error: string) => void;
}

const CheckBox2FA: React.FC<CheckBox2FAProps> = ({ QRcode }) => {
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
        QRcode(response.data);
      }
    } catch (error) {
      console.error(error);;
    }

  };

  return (
    <CheckBoxWrapper>
      <input type="checkbox"
      id="2fa_checkbox"
      checked={isChecked}
      onChange={handleCheckboxChange} 
      />
      <label htmlFor="2fa_checkbox">enable_2fa</label>
      <p>double factor authentification for maximum security</p>
    </CheckBoxWrapper>
  );
};

export default CheckBox2FA;
