import PopUp from "./styles/PopUp.styled";

export default function PasswordPopUp() {
  return (
    <PopUp>
      <p>
        As a reminder, your password must be at least 8 characters long,
        including:
      </p>
      <ul>
        <li>an uppercase letter</li>
        <li>a lowercase letter</li>
        <li>a number</li>
        <li>a special character</li>
      </ul>
    </PopUp>
  );
}
