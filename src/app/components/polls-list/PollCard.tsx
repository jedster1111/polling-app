import { Avatar, Button, Icon, List, Modal } from "antd";
import { ButtonType } from "antd/lib/button";
import * as React from "react";
import { Poll, User } from "../../types";
import PollForm from "../create-poll-form/PollFormContainer";

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
}

const ActionButton: React.SFC<{
  iconType: string;
  text: string;
  handleClick?: () => void;
  buttonType?: ButtonType;
  link?: boolean;
}> = ({ iconType, text, handleClick, buttonType, link }) => {
  const actionButtonTemplate = (
    <Button onClick={handleClick} type={buttonType || "default"}>
      {text}
      {<Icon type={iconType} style={{ marginRight: 8 }} />}
    </Button>
  );
  const button = link ? actionButtonTemplate : <a>{actionButtonTemplate}</a>;
  return button;
};

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

  const actions = props.isOwner
    ? [detailButton, editButton, deleteButton]
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
