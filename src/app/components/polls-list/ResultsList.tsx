import * as React from "react";
import styled from "styled-components";
import { Option } from "../../../../server/models/database";
import ResultsColumn from "./ResultsColumn";

interface ResultsListProps {
  options: Option[];
}

const ResultsListContainer = styled.div<{}>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  grid-gap: 5px;
  justify-content: space-between;
  padding: 5px 8px;
  width: 100%;
`;

const sortOptions = (options: Option[]) => {
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
