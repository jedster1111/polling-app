import * as React from "react";
import { connect } from "react-redux";
import {
  closePoll,
  deletePoll,
  discardUpdatePollForm,
  fetchPolls,
  navigateToPoll,
  openPoll,
  showUpdatePollForm,
  toggleShowResults,
  voteOption
} from "../../actions/actions";
import { StoreState } from "../../reducers/rootReducer";
import { Poll, User } from "../../types";
import { VoteInput } from "../poll-detail/PollDetailContainer";
import PollsList from "./PollsList";

interface PollsListContainerProps {
  user: User;
  polls: Poll[];
  fetchPolls: (namespace: string) => any;
  voteOption: (
    voteInput: VoteInput,
    isAddingVote: boolean,
    namespace: string
  ) => any;
  toggleShowResults: (pollId: string) => void;
  deletePoll: (userId: string, pollId: string, namespace: string) => any;
  showResults: { [pollId: string]: boolean };
  showUpdatePollForm: (pollId: string, poll: Poll) => any;
  editingPoll: null | string;
  discardUpdatePollForm: () => any;
  isLoading: boolean;
  isLoggedIn: boolean;
  namespace: string;
  navigateToPoll: (namespace: string, pollId: string) => any;
  openPoll: (pollId: string, namespace: string) => any;
  closePoll: (pollId: string, namespace: string) => any;
}

const mapStateToProps = (state: StoreState) => {
  const [namespace] = state.router.location.pathname.slice(1).split("/");
  return {
    polls: [...state.pollsState.polls].reverse(),
    user: state.userState.data,
    showResults: state.pollsState.showResults,
    editingPoll: state.pollsState.editingPoll,
    isLoading: state.pollsState.isLoading,
    isLoggedIn: state.userState.isLoggedIn,
    namespace
  };
};
const mapDispatchToProps = {
  fetchPolls,
  voteOption,
  toggleShowResults,
  deletePoll,
  showUpdatePollForm,
  discardUpdatePollForm,
  navigateToPoll,
  openPoll,
  closePoll
};

class PollsListContainer extends React.Component<PollsListContainerProps> {
  constructor(props: PollsListContainerProps) {
    super(props);
  }
  componentDidMount() {
    this.props.fetchPolls(this.props.namespace);
  }
  handleVote = (isAddingVote: boolean, pollId: string, optionId: string) => {
    this.props.voteOption(
      { userId: this.props.user.id, pollId, optionId },
      isAddingVote,
      this.props.namespace
    );
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
        fetchPolls={() => this.props.fetchPolls(this.props.namespace)}
        handleVote={this.handleVote}
        user={this.props.user}
        showResults={this.props.showResults}
        toggleShowResults={this.handleToggleShowResults}
        deletePoll={(pollId: string) =>
          this.props.deletePoll(
            this.props.user.id,
            pollId,
            this.props.namespace
          )
        }
        showEditForm={this.showEditForm}
        editingPoll={this.props.editingPoll}
        isLoading={this.props.isLoading}
        navigateToPoll={(pollId: string) =>
          this.props.navigateToPoll(this.props.namespace, pollId)
        }
        isLoggedIn={this.props.isLoggedIn}
        openPoll={(pollId: string) =>
          this.props.openPoll(pollId, this.props.namespace)
        }
        closePoll={(pollId: string) =>
          this.props.closePoll(pollId, this.props.namespace)
        }
      />
    );
  }
}

const ConnectedPollsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollsListContainer);

export default ConnectedPollsList;
