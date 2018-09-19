import * as React from "react";
import styled from "styled-components";
import PollFormLabel from "./PollFormLabel";
import TextInput from "./TextInput";

interface SingleInputProps {
  id: string;
  labelText: string;
  placeholder?: string;
  value: string;
  valid?: boolean;
  error?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SingleInputContainer = styled.div<{}>`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  border-bottom: solid 1px #7a6263;
  margin: 3px 3px;
  padding: 2px 5px;
`;

const SingleInput = (props: SingleInputProps) => {
  const { labelText, ...other } = props;
  return (
    <SingleInputContainer>
      <PollFormLabel>{labelText}:</PollFormLabel>
      <TextInput {...other} />
    </SingleInputContainer>
  );
};

export default SingleInput;
