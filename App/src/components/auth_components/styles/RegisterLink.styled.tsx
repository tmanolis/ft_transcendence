import styled from "styled-components";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

export const RegisterLink = styled(Link)`
  background: none;
  color: #766e6e;
  font-family: "JetBrains Mono", monospace;
  font-size: 75%;
  width: 100%;
  margin-bottom: 10px;
  border: none;
  text-align: right;
  padding-right: 37px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
