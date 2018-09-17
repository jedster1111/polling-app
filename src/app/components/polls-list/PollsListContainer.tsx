import * as React from "react";
import { connect } from "react-redux";
import { Poll } from "../../../../server/models/database";
import { fetchPolls } from "../../actions/actions";
import { InitialState } from "../../reducers/rootReducer";
import PollsList from "./PollsList";

interface PollsListContainerProps {
  polls: Poll[];
  fetchPolls: () => any;
}

const mapStateToProps = (state: InitialState) => {
  return {
    polls: state.pollsState.polls
  };
};
const mapDispatchToProps = {
  fetchPolls
};

class PollsListContainer extends React.Component<PollsListContainerProps> {
  constructor(props: PollsListContainerProps) {
    super(props);
  }
  render() {
    return (
      <PollsList polls={this.props.polls} fetchPolls={this.props.fetchPolls} />
    );
  }
}

const ConnectedPollsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollsListContainer);

export default ConnectedPollsList;
