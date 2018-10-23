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
}>`
  color: ${({ numberOfVotes, voteLimit }) =>
    numberOfVotes && voteLimit && numberOfVotes > voteLimit
      ? "red"
      : "inherit"};
`;

const VoteDisplay: React.SFC<VoteDisplayProps> = props => {
  const numberOfVotes = props.poll.options.filter(option =>
    option.votes.find(vote => vote.id === props.user.id)
  ).length;

  const VoteCount = props.isLoggedIn ? (
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
  return (
    <React.Fragment>
      {VoteCount}
      <VoteDisplayContainer>
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
