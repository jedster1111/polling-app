import { Icon } from "antd";
import * as React from "react";
import styled from "styled-components";
import { Poll, User } from "../types";

interface VoteDisplayProps {
  poll: Poll;
  user: User;
  isLoggedIn: boolean;
}

const VoteDisplayContainer = styled.p<{
  numberOfVotes?: number;
  voteLimit?: number;
  isOpen: boolean;
}>`
  color: ${({ numberOfVotes, voteLimit, isOpen }) =>
    (numberOfVotes && voteLimit && numberOfVotes > voteLimit) || !isOpen
      ? "red"
      : "inherit"};
`;

const VoteDisplay: React.SFC<VoteDisplayProps> = props => {
  const numberOfVotes = calculateTotalVotesByUser(props.user.id, props.poll);
  const { isOpen } = props.poll;
  const VoteCount = props.isLoggedIn ? (
    <VoteDisplayContainer
      numberOfVotes={numberOfVotes}
      voteLimit={props.poll.voteLimit}
      isOpen={isOpen}
    >
      Your Votes: {numberOfVotes} / {props.poll.voteLimit}
    </VoteDisplayContainer>
  ) : (
    <VoteDisplayContainer isOpen={isOpen}>
      Vote Limit: {props.poll.voteLimit}
    </VoteDisplayContainer>
  );
  return (
    <React.Fragment>
      <span id="vote-display-count">{VoteCount}</span>
      <VoteDisplayContainer isOpen={isOpen} id="vote-display-is-open">
        Poll is{" "}
        {props.poll.isOpen ? (
          <span>
            open <Icon type="unlock" />
          </span>
        ) : (
          <span>
            closed <Icon type="lock" />
          </span>
        )}
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
