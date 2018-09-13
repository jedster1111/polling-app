import styled from "styled-components";

interface ButtonProps {
  create?: boolean;
  discard?: boolean;
}

const Button = styled.button<ButtonProps>`
  transition: all 0.2s;
  outline: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 40px;
  margin: 5px 0px;
  background-color: "lightgrey";
  background-color: ${props => props.create && "lightgreen"};
  background-color: ${props => props.discard && "red"};
  &:hover {
    border: 2px solid black;
    width: 105px;
  }
`;

export default Button;
