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
}

const PollContainer = styled.div<{}>`
  display: flex;
  flex-wrap: wrap;
  max-width: 800px;
  border: solid 1px black;
`;

const PollCard = (props: PollCardProps) => (
  <PollContainer>
    <PollInfo
      creatorName={props.creatorName}
      description={props.description}
      pollName={props.pollName}
    />
    <OptionsList options={props.options} />
  </PollContainer>
);

export default PollCard;
