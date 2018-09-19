import * as React from "react";
import styled from "styled-components";

interface OptionButtonProps {
  add?: boolean;
  remove?: boolean;
  onClick?: () => void;
}

const StyledOptionButton = styled.button<OptionButtonProps>`
  outline: none;
  width: 22px;
  height: 22px;
  box-sizing: border-box;
  margin: 3px 8px;
  padding: 0;
  border-radius: 100%;
  border: solid 2px black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  font-weight: bold;
  line-height: 20px;
  background-color: ${props =>
    props.add ? "lightgreen" : props.remove ? "lightcoral" : "lightgrey"};
  &:focus {
    border-color: darkgrey;
  }
  &:active {
    border-color: white;
  }
`;

export const OptionButton = (props: OptionButtonProps) => (
  <StyledOptionButton {...props} type="button">
    {props.add ? "+" : props.remove ? "-" : null}
  </StyledOptionButton>
);

export default OptionButton;
