import axios from "axios";
import React, { useEffect, useState } from "react";
import { CheckBoxWrapper } from "./styles/CheckBox2FA.styled";

interface CheckBox2FAProps {
  QRcode: (error: string) => void;
}

const CheckBox2FA: React.FC<CheckBox2FAProps> = ({ QRcode }) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
          withCredentials: true,
        });
        setIsChecked(response.data.twoFAActivated);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newCheckedValue = event.target.checked;

    setIsChecked(newCheckedValue);

    const updateDTO = {
      twoFAActivated: newCheckedValue,
    };

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/user/update`,
        updateDTO,
        { withCredentials: true },
      );
      if (newCheckedValue) {
        QRcode(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CheckBoxWrapper>
      <div>
        <input
          type="checkbox"
          id="2fa_checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="2fa_checkbox">enable_2fa</label>
      </div>
      <p>double factor authentification for maximum security</p>
    </CheckBoxWrapper>
  );
};

export default CheckBox2FA;
