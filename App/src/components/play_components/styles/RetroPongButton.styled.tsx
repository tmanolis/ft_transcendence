import styled from "styled-components";
import retro_pong from "../../../assets/retro_pong.png";

export const RetroPongButton = styled.button`
  background: url(${retro_pong});
  border-radius: 5px;
  border: none;
  box-shadow:5px 5px 5px white;
  cursor: pointer;
  margin: 20px;
  width: 433px;
  height: 213px;
  flex-grow: 0;
  flex-shrink: 0;
  transition: transform .3s ease;
  &:hover {
    transform: scale(1.1);
  }
`;
