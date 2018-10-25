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
  const numberOfVotes = props.poll.options.filter(option =>
    option.votes.find(vote => vote.id === props.user.id)
  ).length;
  const { isOpen } = props.poll;
  const VoteCount = props.isLoggedIn ? (
    <VoteDisplayContainer
      numberOfVotes={numberOfVotes}
      voteLimit={props.poll.voteLimit}
      isOpen={isOpen}
    >
      Votes: {numberOfVotes} / {props.poll.voteLimit}
    </VoteDisplayContainer>
  ) : (
    <VoteDisplayContainer isOpen={isOpen}>
      Vote Limit: {props.poll.voteLimit}
    </VoteDisplayContainer>
  );
  return (
    <React.Fragment>
      {VoteCount}
      <VoteDisplayContainer isOpen={isOpen}>
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

export default VoteDisplay;
