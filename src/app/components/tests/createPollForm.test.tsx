import { shallow } from "enzyme";
import * as React from "react";
import TextInput from "../create-poll-form/TextInput";

describe("Testing createPollForm components", () => {
  describe("Testing Text Input", () => {
    test("Text input should render correctly", () => {
      expect(
        shallow(
          <TextInput
            handleChange={() => {
              console.log("changed");
            }}
            id="snapshotTesting"
            value="test"
          />
        )
      ).toMatchSnapshot();
    });
  });
});
