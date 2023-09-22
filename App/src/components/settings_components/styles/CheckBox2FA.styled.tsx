import styled from "styled-components";

export const CheckBoxWrapper = styled.div`
  font-family: "JetBrains Mono", monospace;
  margin: 25px;

  div {
	display: flex;
  }

  input[type="checkbox"] {
    width: 15px; /* Increase the size of the checkbox */
    height: 15px; /* Increase the size of the checkbox */
    border: 2px solid #000;
	border-radius: 0.10em;
    background: rgba(217, 217, 217, 0.00);
    appearance: none; /* Remove default browser styles */
    cursor: pointer;

	display: grid;
  	place-content: center;

	&:checked::before {
      content: "\u00D7"; /* Unicode checkmark character : can change it to 2713 to be clearer */ 
      font-size: 20px; /* Adjust the size of the checkmark */
      color: #000; /* Color of the checkmark */
    }
  }

  label {
    color: #000;
    font-size: 14px;
    font-style: normal;
    font-weight: 550;
    margin-left: 5px; /* Add some space between the checkbox and label */
	margin-top: 2.5px;
  }

  p {
    color: rgba(0, 0, 0, 0.60);
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    margin: 0px;
	margin-left: 10px;
    padding: 2px;
    width: 284px;
  }
`;
