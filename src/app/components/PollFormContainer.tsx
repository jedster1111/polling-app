import * as React from "react";
import { connect } from "react-redux";
import { PollInput } from "../../../server/models/database";
import { createPoll, fetchPolls } from "../actions/actions";
import PollForm from "./PollForm";

const mapDispatchToProps = (dispatch: any) => {
  return {
    addPoll: (poll: PollInput) => dispatch(createPoll(poll)),
    fetchPolls: () => dispatch(fetchPolls())
  };
};

interface Props {
  addPoll: (pollInput: PollInput) => void;
  fetchPolls: () => void;
}
interface State {
  pollData: PollInput;
}
class PollFormContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pollData: {
        creatorName: "",
        pollName: "",
        description: "",
        options: ["", "", ""]
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.persist();
    // optionInput changed
    if (/^(optionInput)/.test(e.target.id)) {
      this.setState(prevState => {
        const newOptions = [...prevState.pollData.options];
        const optionIndex = parseInt(
          e.target.id.replace(/^(optionInput)/, ""),
          10
        );
        newOptions[optionIndex] = e.target.value;
        return {
          pollData: {
            ...prevState.pollData,
            options: newOptions
          }
        };
      });
      // Others changed
    } else {
      this.setState(prevState => ({
        pollData: { ...prevState.pollData, [e.target.id]: e.target.value }
      }));
    }
  }
  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { creatorName, pollName, description, options } = this.state.pollData;
    this.props.addPoll({ creatorName, pollName, description, options });
    this.setState(() => ({
      pollData: {
        creatorName: "",
        pollName: "",
        description: "",
        options: ["test"]
      }
    }));
  }
  render() {
    const pollData = this.state.pollData;
    return (
      <React.Fragment>
        <PollForm
          handleChange={this.handleChange}
          handleSubmitPoll={this.handleSubmit}
          pollInput={pollData}
          fetchPolls={this.props.fetchPolls}
        />
      </React.Fragment>
    );
  }
}

const connectedPollForm = connect(
  null,
  mapDispatchToProps
)(PollFormContainer);

export default connectedPollForm;
