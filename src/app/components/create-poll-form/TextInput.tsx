import * as React from "react";
import styled from "styled-components";

export interface TextInputProps {
  placeholder?: string;
  valid?: boolean;
  error?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
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
  margin: 3px 4px;
  padding: 5px 5px;
  box-sizing: border-box;
  &:focus {
    border-width: 2px;
  }
`;

const StyledTextInput = (props: TextInputProps) => (
  <TextInput
    type="text"
    onChange={props.handleChange}
    value={props.value}
    {...props}
  />
);

export default StyledTextInput;
