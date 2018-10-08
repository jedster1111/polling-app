import * as React from "react";
import styled from "styled-components";
import OptionButton from "./AddRemoveOptionButton";
import Label from "./PollFormLabel";
import { SingleInputContainer } from "./SingleInput";
import StyledTextInput from "./TextInput";

const StyledOptionsInputContainer = styled.div<{}>`
  flex: 1;
  flex-wrap: wrap;
  display: flex;
  max-width: 600px;
`;
const StyledOptionTextInput = styled(StyledTextInput)`
  flex: 1 1 100%;
  margin-left: 0;
  margin-right: 0;
`;
StyledOptionTextInput.displayName = "StyledOptionTextInput";
const SingleOptionInputContainer = styled.div<{}>`
  flex: 1 1 100%;
  display: flex;
  flex-wrap: nowrap;
  margin: 0;
  align-items: center;
`;
interface OptionsInputProps {
  values: Array<{ optionId: string; value: string }>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addPollOption: () => void;
  removePollOption: (index: number) => void;
  edit?: boolean;
}

const StyledButton = styled(OptionButton)`
  margin-left: auto;
`;

const OptionsInput = (props: OptionsInputProps) => {
  return (
    <SingleInputContainer>
      <Label>Options: </Label>
      <StyledOptionsInputContainer>
        {props.values.map((option, index) => (
          <SingleOptionInputContainer key={index}>
            <StyledOptionTextInput
              id={`optionInput${index + 1}`}
              placeholder={option.optionId ? "existing option" : "new option"}
              value={option.value}
              handleChange={props.handleChange}
            />
            {!option.optionId && (
              <OptionButton
                remove
                onClick={() => props.removePollOption(index)}
              />
            )}
          </SingleOptionInputContainer>
        ))}
        <StyledButton add onClick={props.addPollOption} />
      </StyledOptionsInputContainer>
    </SingleInputContainer>
  );
};

export default OptionsInput;
