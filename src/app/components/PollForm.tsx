import * as React from "react";
import { PollInput } from "../../../server/models/database";

interface PollFormProps {
  handleSubmitPoll: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pollInput: PollInput;
}

const PollForm = (props: PollFormProps) => (
  <form onSubmit={props.handleSubmitPoll}>
    <div>
      <label>Your name?</label>
      <input
        id="creatorName"
        type="text"
        value={props.pollInput.creatorName}
        onChange={props.handleChange}
      />
      <label>Title of your poll?</label>
      <input
        id="pollName"
        type="text"
        value={props.pollInput.pollName}
        onChange={props.handleChange}
      />
      <label>Enter a short description?</label>
      <input
        id="description"
        value={props.pollInput.description}
        onChange={props.handleChange}
      />
      <label>Options</label>
      <div>TODO</div>
      <button type="submit">Add Poll</button>
    </div>
  </form>
);

export default PollForm;
