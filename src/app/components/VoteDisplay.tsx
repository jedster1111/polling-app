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
  display: flex;
  flex-wrap: wrap;
  color: ${({ numberOfVotes, voteLimit, isOpen, size }) =>
    (voteLimit && numberOfVotes && numberOfVotes > voteLimit) || !isOpen
      ? "red"
      : "inherit"};
  font-size: ${({ size }) => (size === "large" ? "40px" : "inherit")};
`;

const VoteDisplay: React.SFC<VoteDisplayProps> = props => {
  const numberOfVotes = calculateTotalVotesByUser(props.user.id, props.poll);
  const { voteLimit } = props.poll;

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
        <div>{props.isLoggedIn ? "Your Votes" : "Vote Limit"}</div>
        <div>
          {props.isLoggedIn ? `${numberOfVotes} / ${voteLimit}` : voteLimit}
        </div>
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
