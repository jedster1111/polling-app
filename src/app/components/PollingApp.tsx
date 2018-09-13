import * as React from "react";
import ConnectedPollForm from "../components/create-poll-form/PollFormContainer";

class PollingApp extends React.Component {
  render() {
    return <ConnectedPollForm />;
  }
}

export default PollingApp;
