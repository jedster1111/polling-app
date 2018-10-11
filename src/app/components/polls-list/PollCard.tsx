import { Avatar, Button, Icon, List } from "antd";
import * as React from "react";
import styled from "styled-components";
import { Poll, User } from "../../types";
import OptionButton from "../create-poll-form/AddRemoveOptionButton";
// import ConnectedPollFormContainer from "../create-poll-form/PollFormContainer";
// import OptionsList from "./OptionsList";
// import PollInfo from "./PollInfo";
// import ResultsList from "./ResultsList";

export interface PollCardProps {
  poll: Poll;
  user: User;
  handleVote: (pollId: string, optionId: string) => void;
  deletePoll: (userId: string, pollId: string) => void;
  toggleShowResults: (pollId: string) => void;
  showResults: boolean;
  showEditForm: (pollId: string) => void;
  isEditing?: boolean;
  isOwner?: boolean;
}

// const PollContainer = styled.div<{}>`
//   position: relative;
//   align-self: stretch;
//   display: block;
//   max-width: 1000px;
//   min-width: 170px;
//   border: solid 1px black;
//   margin: 5px 0;
//   padding: 4px 3px;
//   background-color: white;
// `;
const DeletePollButton = styled(OptionButton)`
  position: absolute;
  margin: 0;
  right: 4px;
  top: 3px;
`;
// const InnerContainer = styled.div`
//   display: flex;
//   flex-wrap: wrap;
// `;

DeletePollButton.displayName = "DeletePollButton";

const IconText: React.SFC<{ type?: string; text: string }> = ({
  type,
  text
}) => (
  <Button>
    {text}
    {type && <Icon type={type} style={{ marginRight: 8 }} />}
  </Button>
);

const PollCard = (props: PollCardProps) => {
  const actions = props.isOwner
    ? [<IconText type="edit" text="Edit" />, <IconText text="Vote" />]
    : [<IconText type="check" text="Vote" />];
  return (
    <List.Item key={props.poll.pollId} actions={actions}>
      <List.Item.Meta
        avatar={
          props.poll.creator.photos && (
            <Avatar src={props.poll.creator.photos[0].value} />
          )
        }
        title={<p>{props.poll.pollName}</p>}
        description={
          <span>
            <p>{props.poll.description}</p>
            <p>
              {props.poll.creator.displayName || props.poll.creator.userName}
            </p>
          </span>
        }
      />
    </List.Item>
  );
};

export default PollCard;
