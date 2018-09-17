import * as React from "react";
import styled from "styled-components";
import ViewResultsButton from "./ViewResultsButton";

interface PollInfoProps {
  pollId: string;
  creatorName: string;
  pollName: string;
  description: string;
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
  padding: 25px 8px;
`;
const PollTitleContainer = styled.div<{}>`
  font-size: 20px;
`;
const DescriptionContainer = styled.div<{}>``;
const CreatorContianer = styled.div<{}>``;

const PollInfo = (props: PollInfoProps) => {
  return (
    <InfoContainer>
      <div>
        <PollTitleContainer>{props.pollName}</PollTitleContainer>
        <DescriptionContainer>{props.description}</DescriptionContainer>
        <CreatorContianer>{props.creatorName}</CreatorContianer>
      </div>
      <ViewResultsButton value={"Results"} to={`/polls/${props.pollId}`} />
    </InfoContainer>
  );
};

export default PollInfo;
