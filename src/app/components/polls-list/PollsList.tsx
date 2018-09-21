import * as React from "react";
import styled from "styled-components";
import { Poll } from "../../../../server/models/database";
import FetchPollsButton from "./FetchPollsButton";
import PollCard from "./PollCard";

export interface PollsListProps {
  polls: Poll[];
  username: string;
  fetchPolls: () => any;
  handleVote: (pollId: string, optionId: string) => void;
  toggleShowResults: (pollId: string) => any;
  deletePoll: (pollId: string) => any;
  showResults: { [pollId: string]: boolean };
  showEditForm: (pollId: string) => void;
  editingPoll: null | string;
}

const PollsListContainer = styled.div<{}>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  min-width: 200px;
  max-width: 1000px;
  border: black solid 1px;
  margin: 0 auto;
  padding: 8px 5px;
  border-radius: 8px;
  background-color: #c6dea6;
`;

const PollsList = (props: PollsListProps) => (
  <PollsListContainer>
    <FetchPollsButton fetchPolls={props.fetchPolls} />
    {props.polls.length > 0 ? (
      props.polls.map(poll => (
        <PollCard
          {...poll}
          handleVote={props.handleVote}
          key={poll.pollId}
          username={props.username}
          showResults={props.showResults[poll.pollId]}
          toggleShowResults={props.toggleShowResults}
          deletePoll={props.deletePoll}
          showEditForm={props.showEditForm}
          isEditing={props.editingPoll === poll.pollId}
          isOwner={props.username === poll.creatorName}
        />
      ))
    ) : (
      <span>No Polls Yet</span>
    )}
  </PollsListContainer>
);

export default PollsList;
