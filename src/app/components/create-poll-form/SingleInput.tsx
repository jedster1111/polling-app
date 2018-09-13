import * as React from "react";
import styled from "styled-components";
import PollFormLabel from "./PollFormLabel";
import TextInput from "./TextInput";

interface SingleInputProps {
  labelText: string;
  placeholder: string;
  value: string;
  valid?: boolean;
  error?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SingleInputContainer = styled.div<{}>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border-bottom: solid 1px lightgrey;
  margin: 3px 3px;
  padding: 2px 5px;
`;

const SingleInput = (props: SingleInputProps) => {
  const { labelText, ...other } = props;
  return (
    <SingleInputContainer>
      <PollFormLabel labelText={labelText} />
      <TextInput {...other} />
    </SingleInputContainer>
  );
};

export default SingleInput;
