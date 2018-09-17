import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { PollInput } from "../../../../server/models/database";
import { changeFormData, createPoll, discardPoll } from "../../actions/actions";
import { InitialState, PollFormInput } from "../../reducers/rootReducer";
import PollForm from "./PollForm";

interface PollFormContainerProps {
  pollFormData: PollInput;
  submitPoll: (poll: PollInput) => any;
  handleChange: (fieldId: string, value: string) => any;
  discardPoll: () => any;
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    submitPoll: (poll: PollFormInput) => dispatch(createPoll(poll)),
    handleChange: (fieldId: string, value: string) =>
      dispatch(changeFormData(fieldId, value)),
    discardPoll: () => dispatch(discardPoll())
  };
};

// To try
// const mapDispatchToProps = {
//   createPoll,
//   changeFormData,
//   discardPoll
// };

const mapStateToProps = (state: InitialState) => {
  return {
    pollFormData: { ...state.pollForm.data, creatorName: state.userState.name }
  };
};

class PollFormContainer extends React.Component<PollFormContainerProps> {
  // constructor(props: PollFormContainerProps) {
  //   super(props);
  // }

  handleSubmitPoll = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputData: PollInput = {
      creatorName: this.props.pollFormData.creatorName,
      description: this.props.pollFormData.description,
      pollName: this.props.pollFormData.pollName,
      options: this.props.pollFormData.options
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
      />
    );
  }
}

const ConnectedPollFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollFormContainer);

export default ConnectedPollFormContainer;
