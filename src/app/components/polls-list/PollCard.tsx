import { Avatar, List, Modal } from "antd";
import * as React from "react";
import { Poll, User } from "../../types";
import PollForm from "../create-poll-form/PollFormContainer";
import VoteDisplay from "../VoteDisplay";
import ActionButton from "./ActionButton";

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
  navigateToPoll: () => void;
  isLoggedIn: boolean;
  closePoll: () => void;
  openPoll: () => void;
}

const PollCard = (props: PollCardProps) => {
  const detailButton = (
    <ActionButton
      iconType="info-circle"
      buttonType="primary"
      text="Details"
      handleClick={props.navigateToPoll}
    />
  );
  const deleteButton = (
    <ActionButton
      iconType="close"
      buttonType="danger"
      text="Delete"
      handleClick={() => props.deletePoll(props.user.id, props.poll.pollId)}
    />
  );
  const editButton = (
    <ActionButton
      iconType="edit"
      text="Edit"
      handleClick={() => props.showEditForm(props.poll.pollId)}
    />
  );
  const closeButton = (
    <ActionButton
      iconType="unlock"
      text="Poll is open"
      handleClick={props.closePoll}
      block
    />
  );
  const openButton = (
    <ActionButton
      iconType="lock"
      text="Poll is closed"
      handleClick={props.openPoll}
      block
    />
  );

  const actions = props.isOwner
    ? [
        detailButton,
        editButton,
        deleteButton,
        props.poll.isOpen ? closeButton : openButton
      ]
    : [detailButton];

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
            <VoteDisplay
              poll={props.poll}
              user={props.user}
              isLoggedIn={props.isLoggedIn}
            />
          </span>
        }
      />
      <Modal
        visible={props.isEditing}
        onCancel={() => props.showEditForm(props.poll.pollId)}
        footer={null}
        width="75%"
        style={{ maxWidth: "800px" }}
      >
        <PollForm edit pollId={props.poll.pollId} />
      </Modal>
    </List.Item>
  );
};

export default PollCard;
