import { Avatar, Card, Icon, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { Poll, PollOption, User } from "../../types";

interface PollDetailProps {
  pollData: Poll | undefined;
  isLoading: boolean;
  userData: User;
  voteOption: (userId: string, pollId: string, optionId: string) => void;
}

const PollDetail: React.SFC<PollDetailProps> = ({
  pollData,
  isLoading,
  userData,
  voteOption
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
  return (
    <Card title={pollName}>
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
      {/* <p>
        {pollId}
        {options.map(option => (
          <p>{option.value}</p>
        ))}
      </p> */}
    </Card>
  );
};

export default PollDetail;
