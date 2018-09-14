import * as React from "react";
import styled from "styled-components";
import Label from "./PollFormLabel";
import { SingleInputContainer } from "./SingleInput";
import StyledTextInput from "./TextInput";

const StyledOptionsInputContainer = styled.div<{}>`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const StyledOptionTextInput = styled(StyledTextInput)``;
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
          <StyledOptionTextInput
            key={index}
            id={`optionInput${index + 1}`}
            placeholder={`Option ${index + 1}`}
            value={value}
            handleChange={props.handleChange}
          />
        ))}
      </StyledOptionsInputContainer>
    </SingleInputContainer>
  );
};

export default OptionsInput;
