import * as React from "react";
import styled from "styled-components";
import PollCard, { PollCardProps } from "./PollCard";

interface PollsListProps {
  polls: PollCardProps[];
}

const PollsListContainer = styled.div<{}>`
  border: 1px solid black;
`;

const PollsList = (props: PollsListProps) => (
  <PollsListContainer>
    {props.polls.map(poll => (
      <PollCard {...poll} />
    ))}
  </PollsListContainer>
);

export default PollsList;
