import styled from "styled-components";

export const SearchBarWrapper = styled.div`
	height: 35px;
	display: flex;
	flex-direction: column; /* Arrange children vertically */
	align-items: center;
	
	input {
		height: 23px;
		color: white;
		text-align: center;
		background-color: rgba(255, 255, 255, 0.20); /* Inner background color */
	}

	  input::placeholder {
		color: rgba(250, 242, 242, 0.7)
	  }

	.dataResult {
		background-color: grey; /* or any other background style */
		// border: 1px solid #ccc; /* Optional: Add a border */
		padding: 5px; /* Optional: Add padding */
		z-index: 1; /* Make sure it appears in front of other elements */
	  }

`;