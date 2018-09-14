import * as React from "react";
import styled from "styled-components";
import { PollInput } from "../../../../server/models/database";
import Buttons from "./AddDiscardButtons";
import OptionsInput from "./OptionsInput";
import SingleInput from "./SingleInput";

interface CreatePollFormProps {
  values: PollInput;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  discardPoll: () => void;
}

const FormContainer = styled.form<{}>`
  flex: 1;
  min-width: 200px;
  border: black solid 1px;
  padding: 8px 5px;
  border-radius: 8px;
  background-color: #c6dea6;
`;

const PollForm = (props: CreatePollFormProps) => (
  <FormContainer onSubmit={props.handleSubmit}>
    <SingleInput
      id="creatorName"
      value={props.values.creatorName}
      labelText="Your Name"
      handleChange={props.handleChange}
      placeholder="Enter your name"
    />
    <SingleInput
      id="pollName"
      value={props.values.pollName}
      labelText="Poll Name"
      handleChange={props.handleChange}
      placeholder="Enter the poll name"
    />
    <SingleInput
      id="description"
      value={props.values.description}
      labelText="Description"
      handleChange={props.handleChange}
      placeholder="Enter the description"
    />
    <OptionsInput
      handleChange={props.handleChange}
      values={props.values.options}
    />
    <Buttons discardPoll={props.discardPoll} />
  </FormContainer>
);

export default PollForm;
