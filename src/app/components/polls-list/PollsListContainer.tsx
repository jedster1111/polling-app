import * as React from "react";
import { connect } from "react-redux";
import { Poll } from "../../../../server/models/database";
import { fetchPolls, voteOption } from "../../actions/actions";
import { InitialState } from "../../reducers/rootReducer";
import PollsList from "./PollsList";

interface PollsListContainerProps {
  creatorName: string;
  polls: Poll[];
  fetchPolls: () => any;
  voteOption: (name: string, pollId: string, optionId: string) => any;
}

const mapStateToProps = (state: InitialState) => {
  return {
    polls: state.pollsState.polls,
    creatorName: state.userState.name
  };
};
const mapDispatchToProps = {
  fetchPolls,
  voteOption
};

class PollsListContainer extends React.Component<PollsListContainerProps> {
  constructor(props: PollsListContainerProps) {
    super(props);
  }
  componentDidMount() {
    this.props.fetchPolls();
  }
  handleVote = (pollId: string, optionId: string) => {
    this.props.voteOption(this.props.creatorName, pollId, optionId);
  };
  render() {
    return (
      <PollsList
        polls={this.props.polls}
        fetchPolls={this.props.fetchPolls}
        handleVote={this.handleVote}
        username={this.props.creatorName}
      />
    );
  }
}

const ConnectedPollsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollsListContainer);

export default ConnectedPollsList;
