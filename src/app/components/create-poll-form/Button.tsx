import * as React from "react";
import styled from "styled-components";

interface ButtonProps {
  create?: boolean;
  discard?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = styled.button<ButtonProps>`
  box-sizing: border-box;
  flex: 1;
  outline: none;
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
    outline: 1px solid black;
  }
`;

export default Button;
