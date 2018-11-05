import { Button } from "antd";
import * as React from "react";
import styled from "styled-components";

interface VoteBarProps {
  maxVotes: number;
  numberOfVotes: number;
  ranking: number;
  handleVote: (isAddingVote: boolean) => void;
}

const BarContainer = styled.div``;
const InnerVoteBar = styled.div<{ percentageWidth: string; ranking: number }>`
  border: 1px solid black;
  box-sizing: border-box;
  transition: all 0.5s;
  background-color: ${({ ranking }) => {
    let color;
    switch (ranking) {
      case 1:
        color = "#FDCA40";
        break;
      case 2:
        color = "#E6F2F2";
        break;
      case 3:
        color = "#EDC9AA";
        break;
      default:
        color = "#AEC5EB";
        break;
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
  ranking,
  handleVote
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
      <Button icon="minus-circle" onClick={() => handleVote(false)} />
      <VoteText>{numberOfVotes}</VoteText>
      <Button icon="plus-circle" onClick={() => handleVote(true)} />
    </div>
  );
};

export default VoteBar;
