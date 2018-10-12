import { Avatar, Card, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import { Poll, PollOption } from "../../types";

export interface PollDetailProps {
  pollData: Poll | undefined;
  isLoading: boolean;
}

const columns: Array<ColumnProps<PollOption>> = [
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

const PollDetail: React.SFC<PollDetailProps> = ({ pollData, isLoading }) => {
  if (!pollData) {
    return <p>That poll doesn't exist</p>;
  }
  const { creator, description, pollName, options } = pollData;
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
