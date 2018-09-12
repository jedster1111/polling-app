import * as React from "react";

import { storiesOf } from "@storybook/react";

import { Fragment } from "react";
import Button from "../src/app/components/Button";
import Test from "../src/app/components/Test";
import StyledTextInput from "../src/app/components/TextInput";

storiesOf("Test", module).add("first one", () => <Test />);
storiesOf("Create Poll Form", module)
  .add("Buttons", () => (
    <Fragment>
      <Button>Default</Button>
      <Button create>Create</Button>
      <Button discard>Discard</Button>
    </Fragment>
  ))
  .add("Text Input", () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "center"
      }}
    >
      <StyledTextInput placeholder="default text input" />
      <StyledTextInput valid placeholder="valid text input" />
      <StyledTextInput error placeholder="invalid text input" />
    </div>
  ));
