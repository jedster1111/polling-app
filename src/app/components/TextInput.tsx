import * as React from "react";
import styled from "styled-components";

interface TextInputProps {
  placeholder?: string;
  valid?: boolean;
  error?: boolean;
}

const TextInput = styled.input<TextInputProps>`
  transition: all 0.2s;
  border: none;
  outline: none;
  border: grey 1px solid;
  border-color: ${props => props.valid && "green"};
  border-color: ${props => props.error && "red"};
  width: 250px;
  height: 35px;
  margin: 8px 4px;
  padding: 5px 5px;
  box-sizing: border-box;
  &:focus {
    border-width: 2px;
  }
`;

const StyledTextInput = (props: TextInputProps) => (
  <TextInput type="text" {...props} />
);

export default StyledTextInput;
