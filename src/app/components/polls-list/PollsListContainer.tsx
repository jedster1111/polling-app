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
  creator: User;
  polls: Poll[];
  fetchPolls: () => any;
  voteOption: (userId: string, pollId: string, optionId: string) => any;
  toggleShowResults: (pollId: string) => void;
  deletePoll: (pollId: string) => any;
  showResults: { [pollId: string]: boolean };
  showUpdatePollForm: (pollId: string, poll: Poll) => any;
  editingPoll: null | string;
  discardUpdatePollForm: () => any;
}

const mapStateToProps = (state: InitialState) => {
  return {
    polls: [...state.pollsState.polls].reverse(),
    creator: state.userState.data,
    showResults: state.pollsState.showResults,
    editingPoll: state.pollsState.editingPoll
  };
};
const mapDispatchToProps = {
  fetchPolls,
  voteOption,
  toggleShowResults,
  deletePoll,
  showUpdatePollForm,
  discardUpdatePollForm
};

class PollsListContainer extends React.Component<PollsListContainerProps> {
  constructor(props: PollsListContainerProps) {
    super(props);
  }
  componentDidMount() {
    this.props.fetchPolls();
  }
  handleVote = (pollId: string, optionId: string) => {
    this.props.voteOption(this.props.creator.id, pollId, optionId);
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
        creator={this.props.creator}
        showResults={this.props.showResults}
        toggleShowResults={this.handleToggleShowResults}
        deletePoll={this.props.deletePoll}
        showEditForm={this.showEditForm}
        editingPoll={this.props.editingPoll}
      />
    );
  }
}

const ConnectedPollsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollsListContainer);

export default ConnectedPollsList;
