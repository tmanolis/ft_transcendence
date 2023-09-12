import React from "react";
import { Link } from "react-router-dom";
import PSSButton from "./styles/LandingButton.styled";

const linkStyle = {
    textDecoration: "none", // Remove text-decoration for the Link
  };

export default function LandingButton() {
    return (
        <Link as="a" to="/menu" style={linkStyle}>
            <PSSButton>
                <a href="#">./</a>
            </PSSButton>
        </Link>
    );
}