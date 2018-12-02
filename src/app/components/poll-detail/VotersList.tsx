import * as React from "react";
import styled from "styled-components";
import { UserItem } from "./createListOfVoters";

interface VotersListProps {
  listOfVoters: UserItem[];
}

const VotersListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const VotersItem = styled.div`
  margin: 2px 5px;
`;

export const VotersList: React.FC<VotersListProps> = ({ listOfVoters }) => {
  const isAnyVoters = listOfVoters.length !== 0;
  return (
    <VotersListContainer>
      {isAnyVoters ? (
        listOfVoters.map(voterItem => (
          <VotersItem key={voterItem.user.id}>
            {`${voterItem.user.displayName || voterItem.user.userName} - ${
              voterItem.numberOfVotes
            }`}
          </VotersItem>
        ))
      ) : (
        <VotersItem>"No one's voted yet!"</VotersItem>
      )}
    </VotersListContainer>
  );
};
