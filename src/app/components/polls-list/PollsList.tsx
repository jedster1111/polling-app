import * as React from "react";
import styled from "styled-components";
import FetchPollsButton from "./FetchPollsButton";
import PollCard, { PollCardProps } from "./PollCard";

export interface PollsListProps {
  polls: PollCardProps[];
  fetchPolls: () => any;
}

const PollsListContainer = styled.div<{}>`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  padding: 5px 6px;
  justify-content: space-around;
  align-items: flex-end;
`;

const PollsList = (props: PollsListProps) => (
  <PollsListContainer>
    <FetchPollsButton fetchPolls={props.fetchPolls} />
    {props.polls.map(poll => (
      <PollCard {...poll} key={poll.pollId} />
    ))}
  </PollsListContainer>
);

export default PollsList;
