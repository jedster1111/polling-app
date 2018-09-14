import * as React from "react";
import { Route } from "react-router";
import ConnectedPollForm from "../components/create-poll-form/PollFormContainer";

class PollingApp extends React.Component {
  render() {
    return <Route path="/" component={ConnectedPollForm} />;
  }
}

export default PollingApp;
