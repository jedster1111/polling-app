import { Avatar, Button, Icon, List, Modal } from "antd";
import * as React from "react";
import styled from "styled-components";
import { Poll, User } from "../../types";
import OptionButton from "../create-poll-form/AddRemoveOptionButton";
import PollForm from "../create-poll-form/PollFormContainer";
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

const ActionButton: React.SFC<{
  type: string;
  text: string;
  handleClick?: () => void;
}> = ({ type, text, handleClick }) => (
  <Button onClick={handleClick}>
    {text}
    {<Icon type={type} style={{ marginRight: 8 }} />}
  </Button>
);

const PollCard = (props: PollCardProps) => {
  const voteButton = <ActionButton type="check" text="Vote" />;

  const editButton = (
    <ActionButton
      type="edit"
      text="Edit"
      handleClick={() => props.showEditForm(props.poll.pollId)}
    />
  );

  const actions = props.isOwner ? [editButton, voteButton] : [voteButton];

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
      <Modal
        visible={props.isEditing}
        onCancel={() => props.showEditForm(props.poll.pollId)}
        footer={null}
      >
        <PollForm edit pollId={props.poll.pollId} />
      </Modal>
    </List.Item>
  );
};

export default PollCard;
