import * as React from "react";
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import {
  closePoll,
  deletePoll,
  discardUpdatePollForm,
  fetchPolls,
  openPoll,
  showUpdatePollForm,
  voteOption
} from "../../actions/actions";
import { InitialState } from "../../reducers/rootReducer";
import { Poll, User } from "../../types";
import PollDetail from "./PollDetail";

interface StateProps {
  pollData: Poll | undefined;
  isLoading: boolean;
  userData: User;
  editingPoll: null | string;
  isLoggedIn: boolean;
}
interface DispatchProps {
  fetchPolls: () => any;
  voteOption: (
    isAddingVote: boolean,
    userId: string,
    pollId: string,
    optionId: string
  ) => any;
  showUpdatePollForm: (pollId: string, poll: Poll) => any;
  discardUpdatePollForm: () => any;
  deletePoll: (userId: string, pollId: string) => any;
  openPoll: (pollId: string) => any;
  closePoll: (pollId: string) => any;
}
type OwnProps = RouteComponentProps<{ id: string }>;

type PollDetailContainerProps = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, InitialState> = (
  state,
  ownProps
) => {
  const { id } = ownProps.match.params;
  return {
    pollData: state.pollsState.polls.find(poll => poll.pollId === id),
    isLoading: state.pollsState.isLoading,
    userData: state.userState.data,
    editingPoll: state.pollsState.editingPoll,
    isLoggedIn: state.userState.isLoggedIn
  };
};
const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = {
  fetchPolls,
  voteOption,
  showUpdatePollForm,
  discardUpdatePollForm,
  deletePoll,
  openPoll,
  closePoll
};

class PollDetailContainer extends React.Component<PollDetailContainerProps> {
  componentDidMount() {
    if (!this.props.pollData) {
      this.props.fetchPolls();
    }
  }
  openPoll = () => {
    const pollData = this.props.pollData;
    if (pollData) {
      this.props.openPoll(pollData.pollId);
    }
  };
  closePoll = () => {
    const pollData = this.props.pollData;
    if (pollData) {
      this.props.closePoll(pollData.pollId);
    }
  };
  render() {
    const isEditing = this.props.pollData
      ? this.props.editingPoll === this.props.pollData.pollId
      : false;
    return (
      <PollDetail
        pollData={this.props.pollData}
        isLoading={this.props.isLoading}
        userData={this.props.userData}
        voteOption={this.props.voteOption}
        showEditForm={this.props.showUpdatePollForm}
        discardUpdatePollForm={this.props.discardUpdatePollForm}
        deletePoll={this.props.deletePoll}
        isEditing={isEditing}
        fetchPolls={this.props.fetchPolls}
        isLoggedIn={this.props.isLoggedIn}
        openPoll={this.openPoll}
        closePoll={this.closePoll}
      />
    );
  }
}

const ConnectedPollDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollDetailContainer);

export default withRouter(ConnectedPollDetailContainer);
