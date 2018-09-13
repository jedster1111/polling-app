import * as React from "react";
import { Fragment } from "react";
import { PollInput } from "../../../server/models/database";

interface PollFormProps {
  handleSubmitPoll: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fetchPolls: () => void;
  pollInput: PollInput;
}

const OptionsInput: React.SFC<{
  options: string[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = props => {
  return (
    <Fragment>
      {props.options.map((option, index) => (
        <input
          key={index}
          id={`optionInput${index}`}
          type="text"
          value={option}
          onChange={props.handleChange}
        />
      ))}
    </Fragment>
  );
};

const PollForm = (props: PollFormProps) => {
  return (
    <Fragment>
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
          <OptionsInput
            handleChange={props.handleChange}
            options={props.pollInput.options}
          />
          <button type="submit">Add Poll</button>
        </div>
      </form>
      <button onClick={props.fetchPolls}>Fetch all polls</button>
    </Fragment>
  );
};
export default PollForm;
