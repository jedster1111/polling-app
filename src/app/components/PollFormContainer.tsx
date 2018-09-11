import * as React from "react";
import { connect } from "react-redux";
import { PollInput } from "../../../server/models/database";
import { addPoll } from "../actions/actions";
import PollForm from "./PollForm";

interface Props {
  addPoll: (pollInput: PollInput) => void;
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
        options: ["test"]
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.persist();
    this.setState(prevState => ({
      pollData: { ...prevState.pollData, [e.target.id]: e.target.value }
    }));
  }
  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { creatorName, pollName, description, options } = this.state.pollData;
    this.props.addPoll({ creatorName, pollName, description, options });
    this.setState(prevState => ({
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
      <PollForm
        handleChange={this.handleChange}
        handleSubmitPoll={this.handleSubmit}
        pollInput={pollData}
      />
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addPoll: (poll: PollInput) => dispatch(addPoll(poll))
  };
};

const connectedPollForm = connect(
  null,
  mapDispatchToProps
)(PollFormContainer);

export default connectedPollForm;
