import * as React from "react";
import { connect } from "react-redux";
import { PollInput } from "../../../../server/models/database";
import { changeFormData, createPoll, discardPoll } from "../../actions/actions";
import { InitialState } from "../../reducers/reducers";
import PollForm from "./PollForm";

interface PollFormContainerProps {
  pollFormData: PollInput;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => any;
  submitPoll: (e: React.FormEvent<HTMLFormElement>) => any;
  discardPoll: () => any;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    submitPoll: (poll: PollInput) => dispatch(createPoll(poll)),
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch(changeFormData(e)),
    discardPoll: () => dispatch(discardPoll())
  };
};
const mapStatetoProps = (state: InitialState) => ({
  pollFormData: state.createPollState
});

class PollFormContainer extends React.Component<PollFormContainerProps> {
  render() {
    return (
      <PollForm
        values={this.props.pollFormData}
        handleSubmit={this.props.submitPoll}
        handleChange={this.props.handleChange}
        discardPoll={this.props.discardPoll}
      />
    );
  }
}

const ConnectedPollFormContainer = connect(
  mapStatetoProps,
  mapDispatchToProps
)(PollFormContainer);

export default ConnectedPollFormContainer;
