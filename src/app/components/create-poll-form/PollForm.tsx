import * as React from "react";
import posed from "react-pose";
import styled from "styled-components";
import { PollFormInput } from "../../reducers/rootReducer";
import Buttons from "./AddDiscardButtons";
import OptionsInput from "./OptionsInput";
import SingleInput from "./SingleInput";

interface CreatePollFormProps {
  values: PollFormInput;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  discardPoll: () => void;
  addPollOption: () => void;
  removePollOption: (index: number) => void;
  edit?: boolean;
}

export const FormContainer = styled(
  posed.form({
    enter: { opacity: 1, height: "auto", padding: 5 },
    exit: { opacity: 0, height: 0, padding: 0 }
  })
)`
  flex: 1;
  min-width: 240px;
  max-width: 750px;
  border: black solid 1px;
  margin: 0 auto;
  margin-bottom: 10px;
  padding: 0px 5px;
  border-radius: 8px;
  background-color: #c6dea6;
`;

const PollForm = (props: CreatePollFormProps) => (
  <FormContainer onSubmit={props.handleSubmit} id="createPollForm">
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
      addPollOption={props.addPollOption}
      removePollOption={props.removePollOption}
      edit={props.edit}
    />
    <Buttons edit={props.edit} discardPoll={props.discardPoll} />
  </FormContainer>
);

export default PollForm;
