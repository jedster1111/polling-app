import * as React from "react";
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { fetchPolls, voteOption } from "../../actions/actions";
import { InitialState } from "../../reducers/rootReducer";
import { Poll, User } from "../../types";
import PollDetail from "./PollDetail";

interface StateProps {
  pollData: Poll | undefined;
  isLoading: boolean;
  userData: User;
}
interface DispatchProps {
  fetchPolls: () => any;
  voteOption: (userId: string, pollId: string, optionId: string) => any;
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
    userData: state.userState.data
  };
};
const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = {
  fetchPolls,
  voteOption
};

class PollDetailContainer extends React.Component<PollDetailContainerProps> {
  componentDidMount() {
    if (!this.props.pollData) {
      this.props.fetchPolls();
    }
  }
  render() {
    return (
      <PollDetail
        pollData={this.props.pollData}
        isLoading={this.props.isLoading}
        userData={this.props.userData}
        voteOption={this.props.voteOption}
      />
    );
  }
}

const ConnectedPollDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollDetailContainer);

export default withRouter(ConnectedPollDetailContainer);
