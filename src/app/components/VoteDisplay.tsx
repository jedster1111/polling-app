import * as React from "react";
import styled from "styled-components";
import { Poll, User } from "../types";

type Sizes = "default" | "large";

interface VoteDisplayProps {
  poll: Poll;
  user: User;
  isLoggedIn: boolean;
  size?: Sizes;
}

const VoteDisplayContainer = styled.p<{
  numberOfVotes: number;
  voteLimit: number;
  isOpen: boolean;
  size: Sizes;
}>`
  color: ${({ numberOfVotes, voteLimit, isOpen, size }) =>
    (voteLimit && numberOfVotes && numberOfVotes > voteLimit) || !isOpen
      ? "red"
      : "inherit"};
  font-size: ${({ size }) => (size === "large" ? "22px" : "inherit")};
  white-space: nowrap;
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
        size={props.size || "default"}
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
