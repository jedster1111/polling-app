import * as React from "react";
import styled from "styled-components";
import ViewResultsButton from "./ViewResultsButton";

interface PollInfoProps {
  pollId: string;
  creatorName: string;
  pollName: string;
  description: string;
  toggleShowResults: (pollId: string) => any;
}

const InfoContainer = styled.div<{}>`
  flex: 1 1 170px;
  flex-direction: column;
  justify-items: space-between;
  align-items: center;
  display: flex;
  align-content: stretch;
  text-align: left;
  /* border: solid 1px black; */
  padding: 5px 8px;
`;
const TextContainer = styled.div<{}>`
  padding: 5px;
`;
const PollTitleContainer = styled.div<{}>`
  font-size: 20px;
`;
const DescriptionContainer = styled.div<{}>``;
const CreatorContainer = styled.div<{}>``;

const PollInfo = (props: PollInfoProps) => {
  return (
    <InfoContainer>
      <TextContainer>
        <PollTitleContainer>{props.pollName}</PollTitleContainer>
        <DescriptionContainer>{props.description}</DescriptionContainer>
        <CreatorContainer>{props.creatorName}</CreatorContainer>
      </TextContainer>
      <ViewResultsButton
        value={"Results"}
        to={`/polls/${props.pollId}`}
        pollId={props.pollId}
        toggleShowResults={props.toggleShowResults}
      />
    </InfoContainer>
  );
};

export default PollInfo;
