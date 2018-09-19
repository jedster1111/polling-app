import * as React from "react";
import styled from "styled-components";

interface ButtonProps {
  create?: boolean;
  discard?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = styled.button<ButtonProps>`
  transition: outline 0.25s;
  box-sizing: border-box;
  flex: 1;
  outline: 2px solid transparent;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  max-width: 200px;
  min-width: 100px;
  height: 40px;
  margin: 5px 5px;
  background-color: "grey";
  background-color: ${props => props.create && "lightgreen"};
  background-color: ${props => props.discard && "red"};
  &:hover {
    outline: 2px solid black;
  }
  &:focus {
    outline: 2px solid lightskyblue;
  }
`;

export default Button;
