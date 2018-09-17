import * as React from "react";
import Button from "../create-poll-form/Button";
import { FormContainer } from "../create-poll-form/PollForm";
import SingleInput from "../create-poll-form/SingleInput";

export interface UserDataFormValues {
  name: string;
}

interface UserDataFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  values: UserDataFormValues;
}

const UserDataForm = (props: UserDataFormProps) => (
  <FormContainer onSubmit={props.handleSubmit} id="userDataForm">
    <SingleInput
      id="name"
      value={props.values.name}
      labelText="Your name"
      placeholder="Enter your name"
      handleChange={props.handleChange}
    />
    <Button create>Save Name</Button>
  </FormContainer>
);

export default UserDataForm;
