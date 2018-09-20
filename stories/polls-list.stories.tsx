// import { action } from "@storybook/addon-actions";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Fragment } from "react";
import { MemoryRouter } from "react-router";
import { Option, Poll } from "../server/models/database";
import FetchPollsButton from "../src/app/components/polls-list/FetchPollsButton";
import OptionDisplay from "../src/app/components/polls-list/OptionDisplay";
import OptionsList from "../src/app/components/polls-list/OptionsList";
import PollCard from "../src/app/components/polls-list/PollCard";
import PollInfo from "../src/app/components/polls-list/PollInfo";
import PollsList from "../src/app/components/polls-list/PollsList";
import ResultsColumn from "../src/app/components/polls-list/ResultsColumn";
import ResultsList from "../src/app/components/polls-list/ResultsList";
import ViewResultsButton from "../src/app/components/polls-list/ViewResultsButton";

const createOptions: (n: number) => Option[] = n => {
  const options = new Array(n).fill(null).map((option, index) => ({
    optionId: `${index + 1}`,
    value: `Bean bags, green and black asdfasdf asdfasd asdffdas asdfasdf`,
    votes: ["Jed", "John", "James"]
  }));
  return options;
};
const examplePolls: Poll[] = [
  {
    creatorName: "Jed",
    description: "What furniture do people want for the office?",
    options: createOptions(4),
    pollId: "1",
    pollName: "New Furniture?"
  },
  {
    creatorName: "John",
    description: "What to get for lunch today?",
    options: createOptions(6),
    pollId: "2",
    pollName: "Lunch today?"
  }
];

storiesOf("Polls List", module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={["/"]}>{story()}</MemoryRouter>
  ))
  .add("Link to Poll Results button", () => (
    <ViewResultsButton
      pollId="1"
      value={"Results"}
      toggleShowResults={action("toggled show")}
    />
  ))
  .add("Fetch Polls Button", () => (
    <FetchPollsButton fetchPolls={action("fetching polls")} />
  ))
  .add("Option Display", () => (
    <Fragment>
      <OptionDisplay onClick={action("option 1 clicked")} voted={false}>
        Option 1
      </OptionDisplay>
    </Fragment>
  ))
  .add("Options Container", () => {
    return (
      <Fragment>
        <OptionsList
          username="Jed"
          pollId="1"
          handleVote={action("clicked vote")}
          options={createOptions(3)}
        />
        <OptionsList
          username="Jed"
          pollId="1"
          handleVote={action("clicked vote")}
          options={createOptions(5)}
        />
        <OptionsList
          username="Jed"
          pollId="1"
          handleVote={action("clicked vote")}
          options={createOptions(9)}
        />
      </Fragment>
    );
  })
  .add("Poll Info", () => {
    return (
      <Fragment>
        <PollInfo
          toggleShowResults={action("toggled show")}
          pollId="1"
          creatorName="Jed"
          description="What furniture do you guys want?"
          pollName="New Furniture?"
        />
      </Fragment>
    );
  })
  .add("Poll Card", () => {
    return (
      <Fragment>
        <PollCard
          toggleShowResults={action("toggled show")}
          {...examplePolls[0]}
          handleVote={action("clicked option")}
          username="Jed"
          showResults={false}
          deletePoll={action("deleted poll")}
        />
        <PollCard
          toggleShowResults={action("toggled show")}
          {...examplePolls[0]}
          handleVote={action("clicked option")}
          username="Jed"
          showResults={false}
          deletePoll={action("deleted poll")}
        />
      </Fragment>
    );
  })
  .add("Polls List", () => {
    return (
      <PollsList
        toggleShowResults={action("toggled show")}
        polls={[examplePolls[0], examplePolls[1]]}
        fetchPolls={action("fetching polls")}
        handleVote={action("clicked option")}
        username="Jed"
        showResults={{ 1: false, 2: true }}
        deletePoll={action("deleted poll")}
      />
    );
  })
  .add("Result Column", () => (
    <ResultsColumn
      option={{ votes: ["Jed", "John"], value: "Bean bags", optionId: "1" }}
    />
  ))
  .add("Result List", () => <ResultsList options={createOptions(4)} />);