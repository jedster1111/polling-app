import * as React from "react";
import styled from "styled-components";
import { Poll, User } from "../types";

interface VoteDisplayProps {
  poll: Poll;
  user: User;
  isLoggedIn: boolean;
}

const VoteDisplayContainer = styled.div<{
  numberOfVotes?: number;
  voteLimit?: number;
}>`
  color: ${({ numberOfVotes, voteLimit }) =>
    numberOfVotes && voteLimit && numberOfVotes > voteLimit ? "red" : "black"};
`;

const VoteDisplay: React.SFC<VoteDisplayProps> = props => {
  const numberOfVotes = props.poll.options.filter(option =>
    option.votes.find(vote => vote.id === props.user.id)
  ).length;

  return props.isLoggedIn ? (
    <VoteDisplayContainer
      numberOfVotes={numberOfVotes}
      voteLimit={props.poll.voteLimit}
    >
      Votes: {numberOfVotes} / {props.poll.voteLimit}
    </VoteDisplayContainer>
  ) : (
    <VoteDisplayContainer>
      Vote Limit: {props.poll.voteLimit}
    </VoteDisplayContainer>
  );
};

export default VoteDisplay;
