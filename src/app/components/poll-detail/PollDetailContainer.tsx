import * as React from "react";
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { Action, ActionCreator } from "redux";
import { fetchPolls } from "../../actions/actions";
import { InitialState } from "../../reducers/rootReducer";
import PollDetail, { PollDetailProps } from "./PollDetail";

interface DispatchProps {
  fetchPolls: ActionCreator<Action>;
}
type OwnProps = RouteComponentProps<{ id: string }>;

type PollDetailContainerProps = PollDetailProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<
  PollDetailProps,
  OwnProps,
  InitialState
> = (state, ownProps) => {
  const { id } = ownProps.match.params;
  return {
    pollData: state.pollsState.polls.find(poll => poll.pollId === id),
    isLoading: state.pollsState.isLoading
  };
};
const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = {
  fetchPolls
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
      />
    );
  }
}

const ConnectedPollDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollDetailContainer);

export default withRouter(ConnectedPollDetailContainer);
