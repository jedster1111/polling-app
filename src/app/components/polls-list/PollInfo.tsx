import * as React from "react";
import styled from "styled-components";

interface PollInfoProps {
  creatorName: string;
  pollName: string;
  description: string;
}

const InfoContainer = styled.div<{}>`
  flex: 1 1 170px;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
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
      <PollTitleContainer>{props.pollName}</PollTitleContainer>
      <DescriptionContainer>{props.description}</DescriptionContainer>
      <CreatorContianer>{props.creatorName}</CreatorContianer>
    </InfoContainer>
  );
};

export default PollInfo;
