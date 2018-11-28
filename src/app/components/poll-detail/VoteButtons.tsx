import { Button } from "antd";
import * as React from "react";
import styled from "styled-components";

interface VoteButtonProps {
  handleVote: (isAddingVote: boolean) => void;
  votesByUser: number;
  optionVoteLimit: number;
  pollIsOpen: boolean;
  totalVotesByUser: number;
  pollVoteLimit: number;
}

const ButtonsContainer = styled.div`
  margin: 3px 0;
  display: inline-flex;
  justify-content: center;
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  text-align: center;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  padding-left: 12px;
  padding-right: 12px;
  line-height: 0;
  margin: 0 4px;
  min-height: 30px;
  white-space: nowrap;
  overflow: hidden;
`;

const VoteButtons: React.SFC<VoteButtonProps> = props => {
  const canAddVote = props.votesByUser < props.optionVoteLimit;
  return (
    <ButtonsContainer>
      <Button
        icon="minus-circle"
        onClick={() => props.handleVote(false)}
        className="remove-vote-button"
        disabled={!props.pollIsOpen || !props.votesByUser}
      />
      <TextContainer className="user-votes">
        {props.votesByUser} / {props.optionVoteLimit}
      </TextContainer>
      <Button
        icon="plus-circle"
        onClick={() => props.handleVote(true)}
        className="add-vote-button"
        disabled={
          !canAddVote ||
          !props.pollIsOpen ||
          props.totalVotesByUser >= props.pollVoteLimit
        }
      />
    </ButtonsContainer>
  );
};

export default VoteButtons;
