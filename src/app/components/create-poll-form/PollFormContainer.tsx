import * as React from "react";
import { connect } from "react-redux";
import { PollInput } from "../../../../server/models/database";
import {
  addPollOption,
  changeFormData,
  createPoll,
  discardPoll,
  removePollOption
} from "../../actions/actions";
import { InitialState, PollFormInput } from "../../reducers/rootReducer";
import PollForm from "./PollForm";

interface PollFormContainerProps {
  pollFormData: PollFormInput;
  creatorName: string;
  submitPoll: (poll: PollInput) => any;
  handleChange: (fieldId: string, value: string) => any;
  discardPoll: () => any;
  addPollOption: () => any;
  removePollOption: (index: number) => any;
}

const mapDispatchToProps = {
  submitPoll: createPoll,
  handleChange: changeFormData,
  discardPoll,
  addPollOption,
  removePollOption
};

const mapStateToProps = (state: InitialState) => {
  return {
    pollFormData: state.pollForm.data,
    creatorName: state.userState.data.name
  };
};

class PollFormContainer extends React.Component<PollFormContainerProps> {
  handleSubmitPoll = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputData: PollInput = {
      creatorName: this.props.creatorName,
      description: this.props.pollFormData.description,
      pollName: this.props.pollFormData.pollName,
      options: this.props.pollFormData.options.map(option => option.value)
    };
    this.props.submitPoll(inputData);
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.handleChange(e.target.id, e.target.value);
  };
  render() {
    return (
      <PollForm
        values={this.props.pollFormData}
        handleSubmit={this.handleSubmitPoll}
        handleChange={this.handleChange}
        discardPoll={this.props.discardPoll}
        addPollOption={this.props.addPollOption}
        removePollOption={this.props.removePollOption}
      />
    );
  }
}

const ConnectedPollFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollFormContainer);

export default ConnectedPollFormContainer;
