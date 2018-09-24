import * as React from "react";
import { PoseGroup } from "react-pose";
import styled from "styled-components";
import Button from "../create-poll-form/Button";
import { FormContainer } from "../create-poll-form/PollForm";
import SingleInput from "../create-poll-form/SingleInput";

export interface UserDataFormValues {
  name: string;
}

interface UserDataFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  discardChanges: (e: React.MouseEvent<HTMLButtonElement>) => void;
  values: UserDataFormValues;
}
const ButtonsContainer = styled.div`
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  border: 1px black solid;
  border-radius: 5px;
  padding: 5px 2px;
  margin: 10px auto;
  max-width: 350px;
`;

const UserDataForm = (props: UserDataFormProps) => (
  <PoseGroup animateOnMount>
    <FormContainer
      {...props}
      onSubmit={props.handleSubmit}
      id="userDataForm"
      key="userDataForm"
    >
      <SingleInput
        id="name"
        value={props.values.name}
        labelText="Your name"
        placeholder="Enter your name"
        handleChange={props.handleChange}
      />
      <ButtonsContainer>
        <Button create>Save Name</Button>
        <Button discard type="button" onClick={props.discardChanges}>
          Discard Changes
        </Button>
      </ButtonsContainer>
    </FormContainer>
  </PoseGroup>
);

export default UserDataForm;
