// import { action } from "@storybook/addon-actions";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Fragment } from "react";
import { Option } from "../server/models/database";
import OptionDisplay from "../src/app/components/polls-list/OptionDisplay";
import OptionsList from "../src/app/components/polls-list/OptionsContainer";

const createOptions: (n: number) => Option[] = n => {
  const options = new Array(n).fill(null).map((option, index) => ({
    optionId: `${index + 1}`,
    value: `Bean bags, green and black asdfasdf asdfasd asdffdas asdfasdf`,
    votes: [""]
  }));
  return options;
};

storiesOf("Polls List", module)
  .add("Vote Buttons", () => (
    <Fragment>
      <OptionDisplay onClick={action("option 1 clicked")}>
        Option 1
      </OptionDisplay>
    </Fragment>
  ))
  .add("Options Container", () => {
    return (
      <Fragment>
        <OptionsList options={createOptions(3)} />
        <OptionsList options={createOptions(5)} />
        <OptionsList options={createOptions(9)} />
      </Fragment>
    );
  });
