import styled from "styled-components";

export const SearchBarWrapper = styled.div`
	height: 35px;
	display: flex;
	justify-content: center;

	.dataResultContainer {
		position: relative;
	  }

	.dataResult {
		// position: absolute;
		// top: 222px;
		// width: 240px;
		background-color: grey; /* or any other background style */
		// border: 1px solid #ccc; /* Optional: Add a border */
		padding: 10px; /* Optional: Add padding */
		z-index: 1; /* Make sure it appears in front of other elements */
	  }

`;