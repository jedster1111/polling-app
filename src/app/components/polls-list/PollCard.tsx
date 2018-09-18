import * as React from "react";
import styled from "styled-components";
import { Option } from "../../../../server/models/database";
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
  toggleShowResults: (pollId: string) => any;
  showResults: boolean;
}

const PollContainer = styled.div<{}>`
  align-self: stretch;
  display: flex;
  flex-wrap: wrap;
  max-width: 800px;
  min-width: 170px;
  border: solid 1px black;
  margin: 5px 0;
  background-color: white;
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
  </PollContainer>
);

export default PollCard;
