import { Avatar, Card, Icon, Modal, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { Poll, PollOption, User } from "../../types";
import PollForm from "../create-poll-form/PollFormContainer";
import { ActionButton } from "../polls-list/PollCard";

interface PollDetailProps {
  pollData: Poll | undefined;
  isLoading: boolean;
  userData: User;
  voteOption: (userId: string, pollId: string, optionId: string) => void;
  showEditForm: (pollId: string, poll: Poll) => void;
  discardUpdatePollForm: () => void;
  deletePoll: (userId: string, pollId: string) => void;
  isEditing: boolean;
}

const PollDetail: React.SFC<PollDetailProps> = ({
  pollData,
  isLoading,
  userData,
  voteOption,
  showEditForm,
  deletePoll,
  isEditing,
  discardUpdatePollForm
}) => {
  if (!pollData) {
    return <p>That poll doesn't exist</p>;
  }

  const columns: Array<ColumnProps<PollOption>> = [
    {
      dataIndex: "voted",
      key: "voted",
      render: (text, option) =>
        option.votes.find(voters => voters.id === userData.id) && (
          <Icon type="check" />
        ),
      width: "50px"
    },
    {
      title: "Option",
      dataIndex: "option",
      key: "option",
      render: (text, option) => option.value
    },
    {
      title: "Votes",
      dataIndex: "votes",
      key: "votes",
      render: (text, option) => option.votes.length
    }
  ];
  const { creator, description, pollName, options, pollId } = pollData;
  const isOwner = creator.id === userData.id;
  const EditButton = (
    <ActionButton
      iconType="edit"
      text="Edit"
      handleClick={() => showEditForm(pollData.pollId, pollData)}
    />
  );
  const DeleteButton = (
    <ActionButton
      iconType="close"
      buttonType="danger"
      text="Delete"
      handleClick={() => deletePoll(userData.id, pollData.pollId)}
    />
  );
  const actions = isOwner ? [EditButton, DeleteButton] : [];
  return (
    <Card title={pollName} actions={actions}>
      <Card.Meta
        title={description}
        description={creator.displayName || creator.userName}
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
