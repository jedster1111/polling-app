import * as React from "react";
import styled from "styled-components";
import { Poll } from "../../../../server/models/database";
import FetchPollsButton from "./FetchPollsButton";
import PollCard from "./PollCard";

export interface PollsListProps {
  polls: Poll[];
  fetchPolls: () => any;
  handleVote: (pollId: string, optionId: string) => void;
}

const PollsListContainer = styled.div<{}>`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  padding: 5px 6px;
  justify-content: space-around;
  align-items: center;
`;

const PollsList = (props: PollsListProps) => (
  <PollsListContainer>
    <FetchPollsButton fetchPolls={props.fetchPolls} />
    {props.polls.length > 0 ? (
      props.polls.map(poll => (
        <PollCard {...poll} handleVote={props.handleVote} key={poll.pollId} />
      ))
    ) : (
      <span>No Polls Yet</span>
    )}
  </PollsListContainer>
);

export default PollsList;
