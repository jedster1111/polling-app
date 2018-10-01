import * as React from "react";
import styled from "styled-components";
import { PollOption } from "../../types";

interface ResultsColumnProps {
  option: PollOption;
}

const ResultsColumnContainer = styled.div<{}>`
  border: 1px solid black;
  padding: 10px 13px;
  background-color: #fffcf4;
  box-sizing: border-box;
`;
const TitleText = styled.div<{}>`
  font-size: 20px;
  border-bottom: 1px solid black;
  margin-bottom: 3px;
`;

const VoterText = styled.div<{}>`
  padding-left: 3px;
`;

const ResultsColumn = (props: ResultsColumnProps) => {
  const voteCount = props.option.votes.length;
  const voteText = ` - ${voteCount}`;
  return (
    <ResultsColumnContainer>
      <TitleText>{props.option.value + voteText}</TitleText>
      {props.option.votes.map(voter => (
        <VoterText key={voter.id}>{voter.displayName}</VoterText>
      ))}
    </ResultsColumnContainer>
  );
};

export default ResultsColumn;
