import * as React from "react";
import styled from "styled-components";
import uuid = require("uuid/v1");
import Label from "./PollFormLabel";
import { SingleInputContainer } from "./SingleInput";
import StyledTextInput from "./TextInput";

const StyledOptionsInputContainer = styled.div<{}>`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  flex: 1;
  max-width: 600px;
`;

interface OptionsInputProps {
  values: string[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OptionsInput = (props: OptionsInputProps) => {
  return (
    <SingleInputContainer>
      <Label labelText="Options" />
      <StyledOptionsInputContainer>
        {props.values.map((value, index) => (
          <StyledTextInput
            key={uuid()}
            id={`optionInput${index + 1}`}
            value={value}
            handleChange={props.handleChange}
          />
        ))}
      </StyledOptionsInputContainer>
    </SingleInputContainer>
  );
};

export default OptionsInput;
