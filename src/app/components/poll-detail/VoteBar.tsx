import * as React from "react";
import styled from "styled-components";
import getRankingWithOrdinalIndicator from "./getRankingWithOrdinalIndicator";

interface VoteBarProps {
  maxVotes: number;
  numberOfVotes: number;
  ranking: number;
}

const BarContainer = styled.div`
  width: auto;
`;
const InnerVoteBar = styled.div<{ percentageWidth: string; ranking: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border: 1px solid black;
  box-sizing: border-box;
  transition: all 0.5s;
  overflow: hidden;
  white-space: nowrap;
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

const RankingContainer = styled.span<{ numberOfVotes: number }>`
  transition: all 0.5s;
  opacity: ${({ numberOfVotes }) => numberOfVotes && "1"};
`;

const VoteBar: React.SFC<VoteBarProps> = ({
  maxVotes,
  numberOfVotes,
  ranking
}) => {
  const rankingWithOrdinalIndicator = getRankingWithOrdinalIndicator(ranking);

  const percentageWidth = maxVotes
    ? `${(numberOfVotes * 100) / maxVotes}%`
    : "0%";
  return (
    <div className="vote-bar">
      <BarContainer>
        <InnerVoteBar percentageWidth={percentageWidth} ranking={ranking}>
          <RankingContainer numberOfVotes={numberOfVotes} className="ranking">
            {rankingWithOrdinalIndicator}
          </RankingContainer>
        </InnerVoteBar>
        <div className="total-votes">
          {numberOfVotes ? `Total votes: ${numberOfVotes}` : "No votes"}
        </div>
      </BarContainer>
    </div>
  );
};

export default VoteBar;
