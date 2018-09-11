import * as React from "react";
import { PollInput } from "../../../server/models/database";

interface PollFormProps {
  handleSubmitPoll: (e: React.FormEvent<HTMLFormElement>) => void;
  handleCreatorNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePollNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pollInput: PollInput;
}

const PollForm = (props: PollFormProps) => (
  <form onSubmit={props.handleSubmitPoll}>
    <div>
      <label htmlFor="creatorName">Your name?</label>
      <input
        type="text"
        value={props.pollInput.creatorName}
        onChange={props.handleCreatorNameChange}
      />
      <label htmlFor="pollName">Title of your poll?</label>
      <input
        type="text"
        value={props.pollInput.pollName}
        onChange={props.handlePollNameChange}
      />
      <label htmlFor="description">Enter a short description?</label>
      <input
        type="text"
        value={props.pollInput.description}
        onChange={props.handleDescriptionChange}
      />
      <label htmlFor="pollName">Options</label>
      <div>TODO</div>
    </div>
  </form>
);

export default PollForm;
