import * as React from "react";
import styled from "styled-components";
import Button from "../create-poll-form/Button";
import { FormContainer } from "../create-poll-form/PollForm";
import { SingleInputContainer } from "../create-poll-form/SingleInput";

interface UserDataDisplayProps {
  confirmedValues: {
    name: string;
  };
  toggleChangingName: () => void;
}
const Label = styled.label<{}>`
  font-size: 20px;
  margin-right: 6px;
`;
const TextContainer = styled.div<{}>`
  margin: 0;
  padding: 0;
  font-size: 20px;
`;

const UserDataDisplay = (props: UserDataDisplayProps) => (
  <FormContainer>
    <SingleInputContainer>
      <Label>Name:</Label>
      <TextContainer>{props.confirmedValues.name}</TextContainer>
    </SingleInputContainer>
    <Button onClick={props.toggleChangingName}>Change Name</Button>
  </FormContainer>
);

export default UserDataDisplay;
