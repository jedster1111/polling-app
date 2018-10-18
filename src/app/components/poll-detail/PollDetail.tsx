import { Avatar, Card, Icon, Modal, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import styled from "styled-components";
import { Poll, PollOption, User } from "../../types";
import PollForm from "../create-poll-form/PollFormContainer";
import { ActionButton } from "../polls-list/ActionButton";
import FetchPollsButton from "../polls-list/FetchPollsButton";
import VoteDisplay from "../VoteDisplay";
import VoteBar from "./VoteBar";

interface PollDetailProps {
  pollData: Poll | undefined;
  isLoading: boolean;
  userData: User;
  voteOption: (userId: string, pollId: string, optionId: string) => void;
  showEditForm: (pollId: string, poll: Poll) => void;
  discardUpdatePollForm: () => void;
  deletePoll: (userId: string, pollId: string) => void;
  fetchPolls: () => void;
  isEditing: boolean;
}

const RefreshButtonContainer = styled.div`
  margin-bottom: 24px;
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
  fetchPolls
}) => {
  if (!pollData) {
    return <p>That poll doesn't exist</p>;
  }

  const columns: Array<ColumnProps<PollOption>> = [
    {
      title: "Voted",
      dataIndex: "voted",
      key: "voted",
      render: (text, option) =>
        option.votes.find(voters => voters.id === userData.id) && (
          <Icon type="check" />
        ),
      width: "100px",
      sorter: (a, b) => {
        let result = 0;
        const aIndex = a.votes.find(userVote => userVote.id === userData.id);
        const bIndex = b.votes.find(userVote => userVote.id === userData.id);
        if (aIndex && !bIndex) {
          result = 1;
        } else if (!aIndex && bIndex) {
          result = -1;
        }
        return result;
      }
    },
    {
      title: "Option",
      dataIndex: "option",
      key: "option",
      render: (text, option) => option.value,
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
    },
    {
      title: "Votes",
      dataIndex: "votes",
      key: "votes",
      render: (text, option) => (
        <VoteBar
          numberOfVotes={option.votes.length}
          maxVotes={Math.max(...pollData.options.map(opt => opt.votes.length))}
        />
      ),
      sorter: (a, b) => a.votes.length - b.votes.length
    }
  ];
  const { creator, description, pollName, options, pollId } = pollData;
  const isOwner = creator.id === userData.id;
  const EditButton = (
    <ActionButton
      iconType="edit"
      text="Edit"
      handleClick={() => showEditForm(pollData.pollId, pollData)}
      block
    />
  );
  const DeleteButton = (
    <ActionButton
      iconType="close"
      buttonType="danger"
      text="Delete"
      handleClick={() => deletePoll(userData.id, pollData.pollId)}
      block
    />
  );
  const actions = isOwner ? [EditButton, DeleteButton] : [];

  return (
    <Card title={pollName} actions={actions}>
      <RefreshButtonContainer>
        <FetchPollsButton fetchPolls={fetchPolls} isLoading={isLoading} />
      </RefreshButtonContainer>

      <Card.Meta
        title={description}
        description={
          <span>
            <p>creator.displayName || creator.userName</p>
            {<VoteDisplay poll={pollData} user={userData} />}
          </span>
        }
        avatar={creator.photos && <Avatar src={creator.photos[0].value} />}
        style={{ marginBottom: "15px" }}
      />

      <Table
        columns={columns}
        dataSource={options}
        rowKey={option => option.optionId}
        pagination={false}
        onRow={option => ({
          onClick: () => voteOption(userData.id, pollId, option.optionId)
        })}
      />
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
  );
};

export default PollDetail;
