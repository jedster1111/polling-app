import * as React from "react";
import styled from "styled-components";
import { PollOption } from "../../types";
import ResultsColumn from "./ResultsColumn";

interface ResultsListProps {
  options: PollOption[];
}

const ResultsListContainer = styled.div<{}>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  grid-gap: 5px;
  padding: 5px 8px;
  flex: 0;
`;

const sortOptions = (options: PollOption[]) => {
  return [...options].sort((a, b) => b.votes.length - a.votes.length);
};

const ResultsList = (props: ResultsListProps) => {
  const sortedOptions = sortOptions(props.options);
  return (
    <ResultsListContainer>
      {sortedOptions.map(option => (
        <ResultsColumn key={option.optionId} option={option} />
      ))}
    </ResultsListContainer>
  );
};

export default ResultsList;
