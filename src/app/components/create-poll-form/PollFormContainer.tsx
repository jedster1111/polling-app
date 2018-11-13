import * as React from "react";
import { connect } from "react-redux";
import {
  addPollOption,
  changeFormData,
  createPoll,
  discardPoll,
  discardUpdatePollForm,
  removePollOption,
  updatePoll
} from "../../actions/actions";
import { PollFormInput } from "../../reducers/pollForm";
import { InitialState } from "../../reducers/rootReducer";
import { PollInput, UpdatePollInput, User } from "../../types";
import PollForm from "./PollForm";

interface PollFormContainerProps {
  pollFormData: PollFormInput;
  originalData: PollFormInput;
  user: User;
  isLoading: boolean;
  submitPoll: (poll: PollInput) => any;
  handleChange: (fieldId: string, value: string | number) => any;
  discardPoll: () => any;
  addPollOption: () => any;
  removePollOption: (index: number) => any;
  discardUpdatePollForm: () => any;
  updatePoll: (
    userId: string,
    pollId: string,
    updatePollInput: UpdatePollInput
  ) => any;
}
interface OwnProps {
  edit?: boolean;
  pollId?: string;
}

const mapDispatchToProps = {
  submitPoll: createPoll,
  handleChange: changeFormData,
  discardPoll,
  addPollOption,
  removePollOption,
  discardUpdatePollForm,
  updatePoll
};

const mapStateToProps = (state: InitialState, ownProps: OwnProps) => {
  return {
    pollFormData: state.pollForm.data,
    originalData: state.pollForm.originalData,
    isLoading: state.pollForm.isLoading,
    user: state.userState.data
  };
};

class PollFormContainer extends React.Component<
  PollFormContainerProps & OwnProps
> {
  handleSubmitPoll = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!this.props.edit) {
      const inputData: PollInput = {
        creatorId: this.props.user.id,
        description: this.props.pollFormData.description,
        pollName: this.props.pollFormData.pollName,
        options: this.props.pollFormData.options.map(option => option.value),
        voteLimit: this.props.pollFormData.voteLimit,
        optionVoteLimit: this.props.pollFormData.optionVoteLimit
      };
      this.props.submitPoll(inputData);
    } else if (this.props.edit && this.props.pollId) {
      this.props.updatePoll(this.props.user.id, this.props.pollId, {
        ...this.props.pollFormData
      });
    }
  };
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target.id;
    let value: string | number = e.target.value;
    if (target === "voteLimit" && value) {
      value = parseInt(value, 10);
      // const noOfOptions = this.props.pollFormData.options.reduce(
      //   (prev, option) => {
      //     if (option.value) {
      //       prev++;
      //     }
      //     return prev;
      //   },
      //   0
      // );
      // if (value > noOfOptions) {
      //   value = noOfOptions;
      // }
    }
    this.props.handleChange(target, value);
  };
  clearOption = (index: number) => {
    this.props.handleChange(`optionInput${index + 1}`, "");
  };
  handleDiscardPoll = () => {
    if (this.props.edit) {
      this.props.discardUpdatePollForm();
    }
    this.props.discardPoll();
  };
  render() {
    return (
      <PollForm
        values={this.props.pollFormData}
        handleSubmit={this.handleSubmitPoll}
        handleChange={this.handleChange}
        discardPoll={this.handleDiscardPoll}
        addPollOption={this.props.addPollOption}
        removePollOption={this.props.removePollOption}
        edit={this.props.edit}
        isLoading={this.props.isLoading}
        clearOption={this.clearOption}
        originalValues={this.props.originalData}
      />
    );
  }
}

const ConnectedPollFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollFormContainer);

export default ConnectedPollFormContainer;
