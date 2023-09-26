import axios, { AxiosError } from "axios";
import ConfirmButton from "./styles/ConfirmButton.styled";
import InputSettings, { InputContainer } from "./styles/InputSettings.styled";
import { EditPasswordWrapper } from "./styles/EditPassword.styled";

interface EditPasswordProps {
  onError: (error: string) => void;
  onSuccess: (success: string) => void;
}

const EditPassword: React.FC<EditPasswordProps> = ({ onError, onSuccess }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const old_password = formData.get("old_password");
    const new_password = formData.get("new_password");

    form.reset();

    const updateDTO = {
      oldPassword: old_password,
      password: new_password,
    };

    try {
      const response = await axios.patch(
        "http://localhost:3000/user/update",
        updateDTO,
        { withCredentials: true },
      );
      console.log(response);
      onSuccess("Password was successfully changed");
    } catch (error) {
      handleUpdateError(error as AxiosError);
    }
  };

  const handleUpdateError = (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 400) {
        onError("Old password or new password is incorrect");
      }
    } else {
      onError("Network error occured");
    }
  };

  return (
    <EditPasswordWrapper>
      <form onSubmit={handleSubmit}>
        <InputContainer>
          <InputSettings
            name="old_password"
            type="text"
            id="old_password"
            placeholder="<type old_password>"
          />
        </InputContainer>
        <InputContainer>
          <InputSettings
            name="new_password"
            type="text"
            id="new_password"
            placeholder="<type new_password>"
          />
          <ConfirmButton type="submit">Confirm</ConfirmButton>
        </InputContainer>
      </form>
    </EditPasswordWrapper>
  );
};

export default EditPassword;
