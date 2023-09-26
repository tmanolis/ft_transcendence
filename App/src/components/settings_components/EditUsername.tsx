import axios, { AxiosError } from "axios";
import ConfirmButton from "./styles/ConfirmButton.styled";
import InputSettings, { InputContainer } from "./styles/InputSettings.styled";
import { EditUsernameWrapper } from "./styles/EditUsername.styled";

interface EditUsernameProps {
  onError: (error: string) => void;
}

const EditUsername: React.FC<EditUsernameProps> = ({ onError }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const new_username = formData.get("new_username");

    form.reset();

    const updateDTO = {
      userName: new_username,
    };

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/user/update`,
        updateDTO,
        { withCredentials: true },
      );
      console.log(response);
      window.location.reload();
    } catch (error) {
      handleUpdateError(error as AxiosError);
    }
  };

  const handleUpdateError = (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 500) {
        onError("Username is already used");
      }
    } else {
      onError("Update failed. Please try again!");
    }
  };

  return (
    <EditUsernameWrapper>
      <form onSubmit={handleSubmit}>
        <InputContainer>
          <InputSettings
            name="new_username"
            type="text"
            id="new_username"
            placeholder="<type new_username>"
          />
          <ConfirmButton type="submit">Confirm</ConfirmButton>
        </InputContainer>
      </form>
    </EditUsernameWrapper>
  );
};

export default EditUsername;
