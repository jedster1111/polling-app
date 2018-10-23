import { push } from "connected-react-router";
import * as React from "react";
import { connect } from "react-redux";
import {
  deletePoll,
  discardUpdatePollForm,
  fetchPolls,
  showUpdatePollForm,
  toggleShowResults,
  voteOption
} from "../../actions/actions";
import { InitialState } from "../../reducers/rootReducer";
import { Poll, User } from "../../types";
import PollsList from "./PollsList";

interface PollsListContainerProps {
  user: User;
  polls: Poll[];
  fetchPolls: () => any;
  voteOption: (userId: string, pollId: string, optionId: string) => any;
  toggleShowResults: (pollId: string) => void;
  deletePoll: (userId: string, pollId: string) => any;
  showResults: { [pollId: string]: boolean };
  showUpdatePollForm: (pollId: string, poll: Poll) => any;
  editingPoll: null | string;
  discardUpdatePollForm: () => any;
  isLoading: boolean;
  isLoggedIn: boolean;
  navigateToPoll: (pollId: string) => any;
}

const navigateToPoll = (pollId: string) => push(`/${pollId}`);

const mapStateToProps = (state: InitialState) => {
  return {
    polls: [...state.pollsState.polls].reverse(),
    user: state.userState.data,
    showResults: state.pollsState.showResults,
    editingPoll: state.pollsState.editingPoll,
    isLoading: state.pollsState.isLoading,
    isLoggedIn: state.userState.isLoggedIn
  };
};
const mapDispatchToProps = {
  fetchPolls,
  voteOption,
  toggleShowResults,
  deletePoll,
  showUpdatePollForm,
  discardUpdatePollForm,
  navigateToPoll
};

class PollsListContainer extends React.Component<PollsListContainerProps> {
  constructor(props: PollsListContainerProps) {
    super(props);
  }
  componentDidMount() {
    this.props.fetchPolls();
  }
  handleVote = (pollId: string, optionId: string) => {
    this.props.voteOption(this.props.user.id, pollId, optionId);
  };
  handleToggleShowResults = (pollId: string) => {
    this.props.toggleShowResults(pollId);
  };
  showEditForm = (pollId: string) => {
    if (this.props.editingPoll !== pollId) {
      const pollToUpdate = this.props.polls.find(
        poll => poll.pollId === pollId
      ) as Poll;
      this.props.showUpdatePollForm(pollId, pollToUpdate);
    } else {
      this.props.discardUpdatePollForm();
    }
  };
  render() {
    return (
      <PollsList
        polls={this.props.polls}
        fetchPolls={this.props.fetchPolls}
        handleVote={this.handleVote}
        user={this.props.user}
        showResults={this.props.showResults}
        toggleShowResults={this.handleToggleShowResults}
        deletePoll={this.props.deletePoll}
        showEditForm={this.showEditForm}
        editingPoll={this.props.editingPoll}
        isLoading={this.props.isLoading}
        navigateToPoll={this.props.navigateToPoll}
        isLoggedIn={this.props.isLoggedIn}
      />
    );
  }
}

const ConnectedPollsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollsListContainer);

export default ConnectedPollsList;
