import * as React from "react";
import styled from "styled-components";

interface VoteBarProps {
  maxVotes: number;
  numberOfVotes: number;
  ranking: number;
}

const BarContainer = styled.div``;
const InnerVoteBar = styled.div<{ percentageWidth: string }>`
  border: 1px solid black;
  box-sizing: border-box;
  transition: all 0.5s;
  background-color: green;
  width: ${({ percentageWidth }) => percentageWidth};
  height: 50px;
`;
const VoteText = styled.div`
  font-weight: bold;
  text-align: center;
  width: 100%;
`;

const VoteBar: React.SFC<VoteBarProps> = ({
  maxVotes,
  numberOfVotes,
  ranking
}) => {
  const percentageWidth = maxVotes
    ? `${(numberOfVotes * 100) / maxVotes}%`
    : "0%";
  return (
    <div>
      <BarContainer>
        <InnerVoteBar percentageWidth={percentageWidth} />
        Ranking: {ranking}
      </BarContainer>
      <VoteText>{numberOfVotes}</VoteText>
    </div>
  );
};

export default VoteBar;
