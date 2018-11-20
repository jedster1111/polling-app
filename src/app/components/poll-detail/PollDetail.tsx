import { Avatar, Breadcrumb, Card, Icon, Modal, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { Poll, PollOption, User } from "../../types";
import PollForm from "../create-poll-form/PollFormContainer";
import IsOpenDisplay from "../IsOpenDisplay";
import ActionButton from "../polls-list/ActionButton";
import FetchPollsButton from "../polls-list/FetchPollsButton";
import VoteDisplay, { calculateTotalVotesByUser } from "../VoteDisplay";
import { getRankings, getTotalVotesOnOption } from "./getRankings";
import VoteBar from "./VoteBar";
import VoteButtons from "./VoteButtons";

interface PollDetailProps {
  pollData: Poll | undefined;
  isLoading: boolean;
  userData: User;
  isLoggedIn: boolean;
  windowWidth: number;
  voteOption: (optionId: string, isAddingVote: boolean) => void;
  showEditForm: (pollId: string, poll: Poll) => void;
  discardUpdatePollForm: () => void;
  deletePoll: () => void;
  fetchPolls: () => void;
  isEditing: boolean;
  openPoll: () => void;
  closePoll: () => void;
}

const RefreshButtonContainer = styled.div`
  margin-bottom: 24px;
`;

const ActionButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 10px 4px;
`;

const MetaDescriptionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const MetaDescriptionChild = styled.div`
  flex: 1;
  padding: 2px 5px;
  min-width: 155px;
`;

const VotesContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
`;

const PollDetail: React.SFC<PollDetailProps> = ({
  pollData,
  isLoading,
  userData,
  voteOption,
  showEditForm,
  deletePoll,
  isEditing,
  discardUpdatePollForm,
  fetchPolls,
  isLoggedIn,
  openPoll,
  closePoll,
  windowWidth
}) => {
  if (!pollData) {
    return <p>That poll doesn't exist</p>;
  }

  const optionRankings = getRankings(pollData.options);

  const votedColumn: ColumnProps<PollOption> = {
    title: "Voted",
    dataIndex: "voted",
    key: "voted",
    render: (text, option) => (
      <span className="voted">
        {isLoading ? (
          <Icon type="loading" />
        ) : option.votes.find(
          voter => voter.id === userData.id && voter.numberOfVotes !== 0
        ) ? (
          <Icon type="check" />
        ) : (
          undefined
        )}
      </span>
    ),
    width: "100px",
    sorter: (a, b) => {
      let result = 0;
      const aIndex = a.votes.find(
        voter => voter.id === userData.id && voter.numberOfVotes !== 0
      );
      const bIndex = b.votes.find(
        voter => voter.id === userData.id && voter.numberOfVotes !== 0
      );
      if (aIndex && !bIndex) {
        result = 1;
      } else if (!aIndex && bIndex) {
        result = -1;
      }
      return result;
    }
  };

  const optionColumn: ColumnProps<PollOption> = {
    title: <span>Option</span>,
    dataIndex: "option",
    key: "option",
    render: (text, option) => {
      const voteUserData = option.votes.find(user => user.id === userData.id);
      const votesByUser = voteUserData ? voteUserData.numberOfVotes : 0;

      return (
        <VotesContainer className="value">
          <span>{option.value}</span>
          <VoteButtons
            votesByUser={votesByUser}
            optionVoteLimit={pollData.optionVoteLimit}
            handleVote={(isAddingVote: boolean) =>
              voteOption(option.optionId, isAddingVote)
            }
            pollIsOpen={pollData.isOpen}
            pollVoteLimit={pollData.voteLimit}
            totalVotesByUser={calculateTotalVotesByUser(userData.id, pollData)}
          />
        </VotesContainer>
      );
    },
    sorter: (a, b) => {
      const aValue = a.value.toLowerCase();
      const bValue = b.value.toLowerCase();
      let result = 0;
      if (aValue > bValue) {
        result = -1;
      } else if (aValue < bValue) {
        result = 1;
      }
      return result;
    }
  };

  const votesColumn: ColumnProps<PollOption> = {
    title: "Votes",
    dataIndex: "votes",
    key: "votes",
    width: "250px",
    render: (text, option) => {
      const numberOfVotes = getTotalVotesOnOption(option);
      const ranking = optionRankings[numberOfVotes];
      return (
        <VoteBar
          numberOfVotes={numberOfVotes}
          maxVotes={Math.max(
            ...pollData.options.map(opt => getTotalVotesOnOption(opt))
          )}
          ranking={ranking}
        />
      );
    },
    sorter: (a, b) => {
      return getTotalVotesOnOption(a) - getTotalVotesOnOption(b);
    }
  };

  const columns: Array<ColumnProps<PollOption>> =
    windowWidth > 500
      ? [votedColumn, optionColumn, votesColumn]
      : [optionColumn, votesColumn];

  const { creator, description, pollName, options } = pollData;
  const isOwner = creator.id === userData.id;

  const style: React.CSSProperties = {
    margin: "5px"
  };

  const EditButton = (
    <ActionButton
      iconType="edit"
      text="Edit"
      handleClick={() => showEditForm(pollData.pollId, pollData)}
      style={style}
      key="edit-button"
      className="edit-button"
    />
  );
  const DeleteButton = (
    <ActionButton
      iconType="close"
      buttonType="danger"
      text="Delete"
      handleClick={() => deletePoll()}
      style={style}
      key="delete-button"
      className="delete-button"
    />
  );
  const closeButton = (
    <ActionButton
      iconType="unlock"
      text="Poll is open"
      handleClick={closePoll}
      style={style}
      key="close-button"
      className="open-button"
    />
  );
  const openButton = (
    <ActionButton
      iconType="lock"
      text="Poll is closed"
      handleClick={openPoll}
      style={style}
      key="open-button"
      className="open-button"
    />
  );

  const actions = isOwner
    ? [EditButton, DeleteButton, pollData.isOpen ? closeButton : openButton]
    : [];

  return (
    <>
      <Breadcrumb style={{ marginBottom: "8px" }}>
        <Breadcrumb.Item>
          <NavLink to={`/${pollData.namespace}`}>{pollData.namespace}</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{pollData.pollName}</Breadcrumb.Item>
      </Breadcrumb>
      <Card
        title={<span id="poll-detail-title">{pollName}</span>}
        className="poll-detail"
      >
        <RefreshButtonContainer>
          <FetchPollsButton fetchPolls={fetchPolls} isLoading={isLoading} />
        </RefreshButtonContainer>

        <Card.Meta
          title={<span id="poll-detail-description">{description}</span>}
          description={
            <MetaDescriptionContainer>
              <MetaDescriptionChild>
                <p id="poll-detail-creator-name">
                  {creator.displayName || creator.userName}
                </p>
                <p>Total votes: {pollData.totalVotes}</p>
                <IsOpenDisplay isOpen={pollData.isOpen} />
              </MetaDescriptionChild>
              <MetaDescriptionChild>
                {
                  <VoteDisplay
                    poll={pollData}
                    user={userData}
                    isLoggedIn={isLoggedIn}
                    size="large"
                  />
                }
              </MetaDescriptionChild>
            </MetaDescriptionContainer>
          }
          avatar={creator.photos && <Avatar src={creator.photos[0].value} />}
          style={{ marginBottom: "15px" }}
        />

        <Table
          // loading={isLoading}
          columns={columns}
          dataSource={options}
          rowKey={option => option.optionId}
          pagination={false}
          // onRow={option => ({
          //   onClick: () => voteOption(false, userData.id, pollId, option.optionId)
          // })}
        />
        <ActionButtonContainer>{actions}</ActionButtonContainer>
        <Modal
          visible={isEditing}
          onCancel={() => discardUpdatePollForm()}
          footer={null}
          width="75%"
          style={{ maxWidth: "800px" }}
        >
          <PollForm edit pollId={pollData.pollId} />
        </Modal>
      </Card>
    </>
  );
};

export default PollDetail;
