import { createGlobalStyle } from 'styled-components';
import backgroundImg from '../assets/global_background.jpeg';
import JBRegular from "../assets/fonts/JetBrainsMono-2.304/fonts/webfonts/JetBrainsMono-Regular.woff2";

 
const GlobalStyle = createGlobalStyle`
  body {
    background: url(${backgroundImg}), lightgray 50% / cover no-repeat;
    background-size: cover;
    position: relative;
    z-index: -1;
    margin: 0;
    padding: 0;
    font-family: "JetBrains Mono", monospace;
    color: white;
    src: url(${JBRegular}) format("woff2");
    font-weight: normal;
    font-style: normal;
    width: 100%;
    height: 100%;
    flex-shrink: 0;
  }
`;
 
export default GlobalStyle;