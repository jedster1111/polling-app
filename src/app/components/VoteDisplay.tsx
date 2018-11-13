import * as React from "react";
import styled from "styled-components";
import { Poll, User } from "../types";

interface VoteDisplayProps {
  poll: Poll;
  user: User;
  isLoggedIn: boolean;
}

const VoteDisplayContainer = styled.p<{
  numberOfVotes: number;
  voteLimit: number;
  isOpen: boolean;
}>`
  color: ${({ numberOfVotes, voteLimit, isOpen }) =>
    (voteLimit && numberOfVotes && numberOfVotes > voteLimit) || !isOpen
      ? "red"
      : "inherit"};
  font-size: 18px;
`;

const VoteDisplay: React.SFC<VoteDisplayProps> = props => {
  const numberOfVotes = calculateTotalVotesByUser(props.user.id, props.poll);
  const { voteLimit } = props.poll;
  const voteDisplayText = props.isLoggedIn
    ? `Your Votes: ${numberOfVotes} / ${voteLimit}`
    : `Vote Limit: ${voteLimit}`;
  return (
    <React.Fragment>
      {/* <span id="vote-display-count">{VoteCount}</span> */}
      <VoteDisplayContainer
        id="vote-display-count"
        numberOfVotes={numberOfVotes}
        voteLimit={props.poll.voteLimit}
        isOpen={props.poll.isOpen}
      >
        {voteDisplayText}
      </VoteDisplayContainer>
    </React.Fragment>
  );
};

export function calculateTotalVotesByUser(userId: string, pollData: Poll) {
  return pollData.options.reduce(
    (prev, option) =>
      prev +
      option.votes.reduce((previous, voteUser) => {
        if (voteUser.id === userId) {
          return previous + voteUser.numberOfVotes;
        } else {
          return previous;
        }
      }, 0),
    0
  );
}

export default VoteDisplay;
