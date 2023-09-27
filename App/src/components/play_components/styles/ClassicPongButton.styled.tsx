import styled from "styled-components";
import classic_pong from "../../../assets/classic_pong.png";

export const ClassicPongButton = styled.button`
  background: url(${classic_pong});
  border-radius: 5px;
  border: none;
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
