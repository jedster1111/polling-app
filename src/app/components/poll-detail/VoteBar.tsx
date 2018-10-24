import * as React from "react";
import styled from "styled-components";

interface VoteBarProps {
  maxVotes: number;
  numberOfVotes: number;
  ranking: number;
}

const BarContainer = styled.div``;
const InnerVoteBar = styled.div<{ percentageWidth: string; ranking: number }>`
  border: 1px solid black;
  box-sizing: border-box;
  transition: all 0.5s;
  background-color: ${({ ranking }) => {
    let color;
    if (ranking === 1) {
      color = "#FDCA40";
    } else if (ranking === 2) {
      color = "#E6F2F2";
    } else if (ranking === 3) {
      color = "#EDC9AA";
    } else {
      color = "#AEC5EB";
    }
    return color;
  }};
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
        <InnerVoteBar percentageWidth={percentageWidth} ranking={ranking} />
        Ranking: {ranking}
      </BarContainer>
      <VoteText>{numberOfVotes}</VoteText>
    </div>
  );
};

export default VoteBar;
