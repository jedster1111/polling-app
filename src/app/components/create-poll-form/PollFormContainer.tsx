import * as React from "react";
import { connect } from "react-redux";
import UrlSafeString from "url-safe-string";
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
import { StoreState } from "../../reducers/rootReducer";
import { PollInput, UpdatePollInput, User } from "../../types";
import PollForm from "./PollForm";

const { generate: makeStringUrlSafe } = UrlSafeString();

interface PollFormContainerProps {
  pollFormData: PollFormInput;
  originalData: PollFormInput;
  user: User;
  isLoading: boolean;
  namespace: string;
  submitPoll: (poll: PollInput) => any;
  handleChange: (fieldId: string, value: string | number) => any;
  discardPoll: (namespace?: string) => any;
  addPollOption: () => any;
  removePollOption: (index: number) => any;
  discardUpdatePollForm: () => any;
  updatePoll: (
    userId: string,
    pollId: string,
    updatePollInput: UpdatePollInput,
    namespace: string
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

const mapStateToProps = (state: StoreState, ownProps: OwnProps) => {
  return {
    pollFormData: state.pollForm.data,
    originalData: state.pollForm.originalData,
    isLoading: state.pollForm.isLoading,
    user: state.userState.data,
    namespace: state.router.location.pathname.slice(1).split("/")[0]
  };
};

class PollFormContainer extends React.Component<
  PollFormContainerProps & OwnProps
> {
  componentDidMount = () => {
    if (!this.props.edit) {
      this.props.discardPoll(this.props.namespace);
    }
  };

  handleSubmitPoll = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!this.props.edit) {
      const inputData: PollInput = {
        creatorId: this.props.user.id,
        description: this.props.pollFormData.description,
        pollName: this.props.pollFormData.pollName,
        options: this.props.pollFormData.options.map(option => option.value),
        voteLimit: this.props.pollFormData.voteLimit,
        optionVoteLimit: this.props.pollFormData.optionVoteLimit,
        namespace: this.props.pollFormData.namespace
      };
      this.props.submitPoll(inputData);
    } else if (this.props.edit && this.props.pollId) {
      this.props.updatePoll(
        this.props.user.id,
        this.props.pollId,
        {
          ...this.props.pollFormData,
          namespace: makeStringUrlSafe(this.props.pollFormData.namespace)
        },
        this.props.originalData.namespace || "public"
      );
    }
  };
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target.id;
    let value: string | number = e.target.value;
    if (target === "voteLimit" && value) {
      value = parseInt(value, 10);
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
