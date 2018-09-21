import * as React from "react";
import styled from "styled-components";
import { Option } from "../../../../server/models/database";
import OptionButton from "../create-poll-form/AddRemoveOptionButton";
import ConnectedPollFormContainer from "../create-poll-form/PollFormContainer";
import OptionsList from "./OptionsList";
import PollInfo from "./PollInfo";
import ResultsList from "./ResultsList";

export interface PollCardProps {
  creatorName: string;
  pollName: string;
  description: string;
  pollId: string;
  options: Option[];
  username: string;
  handleVote: (pollId: string, optionId: string) => void;
  deletePoll: (pollId: string) => void;
  toggleShowResults: (pollId: string) => void;
  showResults: boolean;
  showEditForm: (pollId: string) => void;
  isEditing?: boolean;
  isOwner?: boolean;
}

const PollContainer = styled.div<{}>`
  position: relative;
  align-self: stretch;
  display: block;
  max-width: 1000px;
  min-width: 170px;
  border: solid 1px black;
  margin: 5px 0;
  padding: 4px 3px;
  background-color: white;
`;
const DeletePollButton = styled(OptionButton)`
  position: absolute;
  margin: 0;
  right: 4px;
  top: 3px;
`;
const InnerContainer = styled.div`
  display: flex;
`;

const PollCard = (props: PollCardProps) => (
  <PollContainer id={`poll${props.pollId}`}>
    <InnerContainer>
      <PollInfo
        pollId={props.pollId}
        creatorName={props.creatorName}
        description={props.description}
        pollName={props.pollName}
        toggleShowResults={props.toggleShowResults}
        showEditForm={props.showEditForm}
        isOwner={props.isOwner}
      />
      <OptionsList
        handleVote={props.handleVote}
        pollId={props.pollId}
        options={props.options}
        username={props.username}
      />
    </InnerContainer>
    {props.isEditing &&
      props.isOwner && (
        <ConnectedPollFormContainer edit pollId={props.pollId} />
      )}
    {props.showResults && <ResultsList options={props.options} />}
    {props.isOwner && (
      <DeletePollButton remove onClick={() => props.deletePoll(props.pollId)} />
    )}
  </PollContainer>
);

export default PollCard;
