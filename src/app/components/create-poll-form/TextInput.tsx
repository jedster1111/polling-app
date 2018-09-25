import * as React from "react";
import styled from "styled-components";

export interface TextInputProps {
  id: string;
  placeholder?: string;
  valid?: boolean;
  error?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

// const TextInput = styled.input<{ valid?: boolean; error?: boolean }>`
const TextInput = styled.input<{ valid?: boolean; error?: boolean }>`
  flex: 1 1;
  text-align: center;
  transition: all 0.2s;
  border: none;
  outline: none;
  border: grey 1px solid;
  border-color: ${props => props.valid && "green"};
  border-color: ${props => props.error && "red"};
  max-width: 600px;
  height: 35px;
  margin: 3px 4px;
  padding: 5px 5px;
  box-sizing: border-box;
  &:focus {
    border-width: 2px;
  }
`;

const StyledTextInput = ({ handleChange, ...rest }: TextInputProps) => (
  <TextInput {...rest} type="text" onChange={handleChange} autoComplete="off" />
);

export default StyledTextInput;
