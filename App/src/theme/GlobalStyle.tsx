import { createGlobalStyle } from "styled-components";
import backgroundImg from "../assets/global_background.jpeg";
import JBRegular from "../assets/fonts/JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Regular.woff2";

const GlobalStyle = createGlobalStyle`
  body {
    padding-top: 20px;
    background: url(${backgroundImg});
    background-size: cover;
    background-position-x: center;
    background-repeat: no-repeat;
    position: relative;
    height: 100vh;
    width: 100%;
    z-index: -1;
    margin: 0;
    padding: 0;
    font-family: "JetBrains Mono", monospace;
    color: white;
    src: url(${JBRegular}) format("woff2");
    font-weight: normal;
    font-style: normal;
    flex-shrink: 0;
  }
`;

export default GlobalStyle;
