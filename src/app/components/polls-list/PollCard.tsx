import { Avatar, List, Modal } from "antd";
import * as React from "react";
import { Poll, User } from "../../types";
import PollForm from "../create-poll-form/PollFormContainer";
import IsOpenDisplay from "../IsOpenDisplay";
import VoteDisplay from "../VoteDisplay";
import ActionButton from "./ActionButton";

export interface PollCardProps {
  poll: Poll;
  user: User;
  handleVote: (isAddingVote: boolean, pollId: string, optionId: string) => void;
  deletePoll: (pollId: string) => void;
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
      className="detail"
    />
  );
  const deleteButton = (
    <ActionButton
      iconType="close"
      buttonType="danger"
      text="Delete"
      handleClick={() => props.deletePoll(props.poll.pollId)}
      className="delete"
    />
  );
  const editButton = (
    <ActionButton
      iconType="edit"
      text="Edit"
      handleClick={() => props.showEditForm(props.poll.pollId)}
      className="edit"
    />
  );
  const closeButton = (
    <ActionButton
      iconType="unlock"
      text="Poll is open"
      handleClick={props.closePoll}
      block
      className="open"
    />
  );
  const openButton = (
    <ActionButton
      iconType="lock"
      text="Poll is closed"
      handleClick={props.openPoll}
      block
      className="closed"
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
    <>
      <List.Item key={props.poll.pollId} actions={actions} className="pollCard">
        <List.Item.Meta
          avatar={
            props.poll.creator.photos && (
              <Avatar src={props.poll.creator.photos[0].value} />
            )
          }
          style={{ minWidth: "280px" }}
          title={<p className="title">{props.poll.pollName}</p>}
          description={
            <span>
              <p className="description">{props.poll.description}</p>
              <p className="name">
                {props.poll.creator.displayName || props.poll.creator.userName}
              </p>
              <VoteDisplay
                poll={props.poll}
                user={props.user}
                isLoggedIn={props.isLoggedIn}
              />
              <IsOpenDisplay isOpen={props.poll.isOpen} />
              <p>Total voters: {props.poll.totalVoters}</p>
            </span>
          }
        />
      </List.Item>
      <Modal
        visible={props.isEditing}
        onCancel={() => props.showEditForm(props.poll.pollId)}
        footer={null}
        width="75%"
        style={{ maxWidth: "800px" }}
        destroyOnClose
        centered
      >
        <PollForm edit pollId={props.poll.pollId} />
      </Modal>
    </>
  );
};

export default PollCard;
