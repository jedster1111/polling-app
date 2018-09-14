import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Fragment } from "react";
import Button from "../src/app/components/create-poll-form/Button";
import PollForm from "../src/app/components/create-poll-form/PollForm";
import SingleInput from "../src/app/components/create-poll-form/SingleInput";
import StyledTextInput from "../src/app/components/create-poll-form/TextInput";

const mockSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  action("submitted form")(e);
};

storiesOf("Create Poll Form", module)
  .add("Buttons", () => (
    <Fragment>
      <Button onClick={action("click1")}>Default</Button>
      <Button create onClick={action("click2")}>
        Create
      </Button>
      <Button discard onClick={action("click3")}>
        Discard
      </Button>
    </Fragment>
  ))
  .add("Text Input Box", () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "center"
      }}
    >
      <StyledTextInput
        id="default"
        placeholder="default text input"
        value="test1"
        handleChange={action("changed")}
      />
      <StyledTextInput
        id="valid"
        valid
        placeholder="valid text input"
        value="test2"
        handleChange={action("changed")}
      />
      <StyledTextInput
        id="error"
        error
        placeholder="invalid text input"
        value="test3"
        handleChange={action("changed")}
      />
    </div>
  ))
  .add("Form Input with label", () => (
    <Fragment>
      <SingleInput
        id="creatorName"
        placeholder="Enter your name"
        labelText="Your name"
        value="Jed Thompson"
        handleChange={action("changed")}
      />
      <SingleInput
        id="pollName"
        valid
        placeholder="Enter the poll name"
        labelText="Poll name"
        value="New furniture for the office!"
        handleChange={action("changed")}
      />
    </Fragment>
  ))
  .add("Create poll form", () => (
    <PollForm
      handleChange={action("Value changed")}
      handleSubmit={mockSubmit}
      discardPoll={action("Discarded poll")}
      values={{
        creatorName: "Jed",
        pollName: "New furniture guys!",
        description: "description",
        options: ["test", "test2", "test3"]
      }}
    />
  ));
