import * as React from "react";
import { connect } from "react-redux";
import { Poll } from "../../../../server/models/database";
import {
  deletePoll,
  fetchPolls,
  toggleShowResults,
  voteOption
} from "../../actions/actions";
import { InitialState } from "../../reducers/rootReducer";
import PollsList from "./PollsList";

interface PollsListContainerProps {
  creatorName: string;
  polls: Poll[];
  fetchPolls: () => any;
  voteOption: (name: string, pollId: string, optionId: string) => any;
  toggleShowResults: (pollId: string) => any;
  deletePoll: (pollId: string) => any;
  showResults: { [pollId: string]: boolean };
}

const mapStateToProps = (state: InitialState) => {
  return {
    polls: [...state.pollsState.polls].reverse(),
    creatorName: state.userState.data.name,
    showResults: state.pollsState.showResults
  };
};
const mapDispatchToProps = {
  fetchPolls,
  voteOption,
  toggleShowResults,
  deletePoll
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
  handleToggleShowResults = (pollId: string) => {
    this.props.toggleShowResults(pollId);
  };
  render() {
    return (
      <PollsList
        polls={this.props.polls}
        fetchPolls={this.props.fetchPolls}
        handleVote={this.handleVote}
        username={this.props.creatorName}
        showResults={this.props.showResults}
        toggleShowResults={this.handleToggleShowResults}
        deletePoll={this.props.deletePoll}
      />
    );
  }
}

const ConnectedPollsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollsListContainer);

export default ConnectedPollsList;
