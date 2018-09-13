import * as React from "react";

import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { Fragment } from "react";
import Button from "../src/app/components/create-poll-form/Button";
import SingleInput from "../src/app/components/create-poll-form/SingleInput";
import StyledTextInput from "../src/app/components/create-poll-form/TextInput";
import Test from "../src/app/components/Test";

storiesOf("Test", module).add("first one", () => <Test />);
storiesOf("Create Poll Form", module)
  .add("Buttons", () => (
    <Fragment>
      <Button>Default</Button>
      <Button create>Create</Button>
      <Button discard>Discard</Button>
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
        placeholder="default text input"
        value="test1"
        handleChange={action("changed")}
      />
      <StyledTextInput
        valid
        placeholder="valid text input"
        value="test2"
        handleChange={action("changed")}
      />
      <StyledTextInput
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
        placeholder="Enter your name"
        labelText="Your name"
        value="Jed Thompson"
        handleChange={action("changed")}
      />
      <SingleInput
        valid
        placeholder="Enter the poll name"
        labelText="Poll name"
        value="New furniture for the office!"
        handleChange={action("changed")}
      />
    </Fragment>
  ));
