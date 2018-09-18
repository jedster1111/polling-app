import * as React from "react";
import styled from "styled-components";
import { Option } from "../../../../server/models/database";
import OptionsList from "./OptionsList";
import PollInfo from "./PollInfo";

export interface PollCardProps {
  creatorName: string;
  pollName: string;
  description: string;
  pollId: string;
  options: Option[];
  handleVote: (pollId: string, optionId: string) => void;
}

const PollContainer = styled.div<{}>`
  align-self: stretch;
  display: flex;
  flex-wrap: wrap;
  max-width: 800px;
  min-width: 170px;
  border: solid 1px black;
  margin: 5px 0;
`;

const PollCard = (props: PollCardProps) => (
  <PollContainer id={`poll${props.pollId}`}>
    <PollInfo
      pollId={props.pollId}
      creatorName={props.creatorName}
      description={props.description}
      pollName={props.pollName}
    />
    <OptionsList
      handleVote={props.handleVote}
      pollId={props.pollId}
      options={props.options}
    />
  </PollContainer>
);

export default PollCard;
