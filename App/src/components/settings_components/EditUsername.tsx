import axios, { AxiosError } from "axios";
import ConfirmButton from "./styles/ConfirmButton.styled";

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
        "http://localhost:3000/user/update",
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
    if (error.response) {
      const status = error.response.status;
      if (status === 500) {
        onError("Update failed. Please try again!");
      }
    } else {
      onError("Network error occurred");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          name="new_username"
          type="text"
          id="new_username"
          placeholder="new username"
        />
        <ConfirmButton type="submit">Confirm</ConfirmButton>
      </form>
    </>
  );
};

export default EditUsername;