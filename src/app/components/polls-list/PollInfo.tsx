import * as React from "react";
import styled from "styled-components";

interface PollInfoContainerProps {
  creatorName: string;
  pollName: string;
  description: string;
}

const InfoContainer = styled.div<{}>`
  align-items: flex-end;
  display: inline-flex;
  flex-direction: column;
  text-align: right;
  /* border: solid 1px black; */
  padding: 25px 8px;
`;
const PollTitleContainer = styled.div<{}>`
  font-size: 20px;
`;
const DescriptionContainer = styled.div<{}>`
  padding: 0 5px;
`;
const CreatorContianer = styled.div<{}>`
  padding: 0 13px;
`;

const PollInfoContainer = (props: PollInfoContainerProps) => {
  return (
    <InfoContainer>
      <PollTitleContainer>{props.pollName}</PollTitleContainer>
      <DescriptionContainer>{props.description}</DescriptionContainer>
      <CreatorContianer>{props.creatorName} -</CreatorContianer>
    </InfoContainer>
  );
};

export default PollInfoContainer;
