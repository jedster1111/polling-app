import { Button } from "antd";
import * as React from "react";
import styled from "styled-components";
import getRankingWithOrdinalIndicator from "./getRankingWithOrdinalIndicator";

interface VoteBarProps {
  maxVotes: number;
  numberOfVotes: number;
  ranking: number;
  votesByUser: number;
  handleVote: (isAddingVote: boolean) => void;
}

const BarContainer = styled.div``;
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
const TextContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  text-align: center;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  padding-left: 12px;
  padding-right: 12px;
  line-height: 0;
  margin: 0 4px;
  min-height: 30px;
`;

const ButtonsContainer = styled.div`
  margin: 3px 0;
  display: flex;
  justify-content: center;
`;

const RankingContainer = styled.span<{ numberOfVotes: number }>`
  transition: all 0.5s;
  opacity: ${({ numberOfVotes }) => numberOfVotes && "1"};
`;

const VoteBar: React.SFC<VoteBarProps> = ({
  maxVotes,
  numberOfVotes,
  ranking,
  votesByUser,
  handleVote
}) => {
  const rankingWithOrdinalIndicator = getRankingWithOrdinalIndicator(ranking);

  const percentageWidth = maxVotes
    ? `${(numberOfVotes * 100) / maxVotes}%`
    : "0%";
  return (
    <div>
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
      <ButtonsContainer>
        <Button
          icon="minus-circle"
          onClick={() => handleVote(false)}
          className="remove-vote-button"
        />
        <TextContainer className="user-votes">{votesByUser}</TextContainer>
        <Button
          icon="plus-circle"
          onClick={() => handleVote(true)}
          className="add-vote-button"
        />
      </ButtonsContainer>
    </div>
  );
};

export default VoteBar;
