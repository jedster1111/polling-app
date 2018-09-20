import * as React from "react";
import styled from "styled-components";
import { Option } from "../../../../server/models/database";
import OptionButton from "../create-poll-form/AddRemoveOptionButton";
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
  toggleShowResults: (pollId: string) => any;
  showResults: boolean;
}

const PollContainer = styled.div<{}>`
  position: relative;
  align-self: stretch;
  display: flex;
  flex-wrap: wrap;
  max-width: 800px;
  min-width: 170px;
  border: solid 1px black;
  margin: 5px 0;
  background-color: white;
`;
const DeletePollButton = styled(OptionButton)`
  position: absolute;
  margin: 0;
  right: 4px;
  top: 3px;
`;

const PollCard = (props: PollCardProps) => (
  <PollContainer id={`poll${props.pollId}`}>
    <PollInfo
      pollId={props.pollId}
      creatorName={props.creatorName}
      description={props.description}
      pollName={props.pollName}
      toggleShowResults={props.toggleShowResults}
    />
    <OptionsList
      handleVote={props.handleVote}
      pollId={props.pollId}
      options={props.options}
      username={props.username}
    />
    {props.showResults && <ResultsList options={props.options} />}
    <DeletePollButton remove onClick={() => props.deletePoll(props.pollId)} />
  </PollContainer>
);

export default PollCard;
