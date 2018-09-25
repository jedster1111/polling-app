import * as React from "react";
import posed from "react-pose";
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

export const SingleInputContainer = styled(
  posed.div({
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  })
)<{}>`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
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
