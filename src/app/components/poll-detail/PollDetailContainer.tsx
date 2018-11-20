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
import { StoreState } from "../../reducers/rootReducer";
import { Poll, User } from "../../types";
import PollDetail from "./PollDetail";

interface StateProps {
  pollData: Poll | undefined;
  isLoading: boolean;
  userData: User;
  editingPoll: null | string;
  isLoggedIn: boolean;
  namespace: string;
  pollId: string;
}

export interface VoteInput {
  userId: string;
  pollId: string;
  optionId: string;
}
interface DispatchProps {
  fetchPolls: (namespace: string) => any;
  voteOption: (
    voteInput: VoteInput,
    isAddingVote: boolean,
    namespace: string
  ) => any;
  showUpdatePollForm: (pollId: string, poll: Poll) => any;
  discardUpdatePollForm: () => any;
  deletePoll: (userId: string, pollId: string, namespace: string) => any;
  openPoll: (pollId: string, namespace: string) => any;
  closePoll: (pollId: string, namespace: string) => any;
}
type OwnProps = RouteComponentProps<{ id: string }>;

type PollDetailContainerProps = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, StoreState> = (
  state,
  ownProps
) => {
  const { id } = ownProps.match.params;
  const [
    namespace = "public",
    pollId = "error"
  ] = state.router.location.pathname.slice(1).split("/");
  return {
    pollData: state.pollsState.polls.find(poll => poll.pollId === id),
    isLoading: state.pollsState.isLoading,
    userData: state.userState.data,
    editingPoll: state.pollsState.editingPoll,
    isLoggedIn: state.userState.isLoggedIn,
    namespace,
    pollId
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

interface State {
  windowWidth: number;
  timer: NodeJS.Timeout | undefined;
}

class PollDetailContainer extends React.Component<
  PollDetailContainerProps,
  State
> {
  state = {
    windowWidth: document.body.clientWidth,
    timer: undefined
  };

  handleResize = () => {
    this.setState({
      windowWidth: document.body.clientWidth
    });
  };

  componentDidMount() {
    if (!this.props.pollData) {
      this.props.fetchPolls(this.props.namespace);
    }
    window.addEventListener("resize", this.handleResize);
    const timer = setTimeout(this.handleResize, 1000);
    this.setState({ timer });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    clearTimeout(this.state.timer);
  }

  openPoll = () => {
    const pollData = this.props.pollData;
    if (pollData) {
      this.props.openPoll(pollData.pollId, this.props.namespace);
    }
  };
  closePoll = () => {
    const pollData = this.props.pollData;
    if (pollData) {
      this.props.closePoll(pollData.pollId, this.props.namespace);
    }
  };
  voteOption = (optionId: string, isAddingVote: boolean) => {
    this.props.voteOption(
      { userId: this.props.userData.id, pollId: this.props.pollId, optionId },
      isAddingVote,
      this.props.namespace
    );
  };
  deletePoll = () => {
    this.props.deletePoll(
      this.props.userData.id,
      this.props.pollId,
      this.props.namespace
    );
  };
  fetchPolls = () => {
    this.props.fetchPolls(this.props.namespace);
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
        voteOption={this.voteOption}
        showEditForm={this.props.showUpdatePollForm}
        discardUpdatePollForm={this.props.discardUpdatePollForm}
        deletePoll={this.deletePoll}
        isEditing={isEditing}
        fetchPolls={this.fetchPolls}
        isLoggedIn={this.props.isLoggedIn}
        openPoll={this.openPoll}
        closePoll={this.closePoll}
        windowWidth={this.state.windowWidth}
      />
    );
  }
}

const ConnectedPollDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollDetailContainer);

export default withRouter(ConnectedPollDetailContainer);
