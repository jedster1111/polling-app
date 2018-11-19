import { List } from "antd";
import * as React from "react";
import { Poll, User } from "../../types";
import "./antd-polls-list-override.css";
import FetchPollsButton from "./FetchPollsButton";
import NamespaceDisplay from "./NamespaceDisplay";
import PollCard from "./PollCard";

export interface PollsListProps {
  polls: Poll[];
  user: User;
  fetchPolls: () => any;
  handleVote: (isAddingVote: boolean, pollId: string, optionId: string) => void;
  toggleShowResults: (pollId: string) => any;
  deletePoll: (pollId: string) => any;
  showResults: { [pollId: string]: boolean };
  showEditForm: (pollId: string) => void;
  editingPoll: null | string;
  isLoading: boolean;
  isLoggedIn: boolean;
  navigateToPoll: (pollId: string) => void;
  openPoll: (pollId: string) => void;
  closePoll: (pollId: string) => void;
  namespace: string;
}

const PollsList = (props: PollsListProps) => (
  <>
    <NamespaceDisplay />
    <List
      className="polls-list"
      header={
        <FetchPollsButton
          fetchPolls={props.fetchPolls}
          isLoading={props.isLoading}
        />
      }
      // itemLayout="vertical"
      size="large"
      pagination={{ pageSize: 5 }}
      dataSource={props.polls}
      renderItem={(poll: Poll) => (
        <PollCard
          poll={poll}
          handleVote={props.handleVote}
          key={poll.pollId}
          user={props.user}
          showResults={props.showResults[poll.pollId]}
          toggleShowResults={props.toggleShowResults}
          deletePoll={props.deletePoll}
          showEditForm={props.showEditForm}
          isEditing={props.editingPoll === poll.pollId}
          isOwner={props.user.id === poll.creator.id}
          navigateToPoll={() => props.navigateToPoll(poll.pollId)}
          isLoggedIn={props.isLoggedIn}
          openPoll={() => props.openPoll(poll.pollId)}
          closePoll={() => props.closePoll(poll.pollId)}
        />
      )}
    />
  </>
);

export default PollsList;
