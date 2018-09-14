import * as React from "react";
import { Route, Switch } from "react-router";
import CreatePollPage from "./pages/CreatePollPage";
import HomePage from "./pages/HomePage";

class PollingApp extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/create-poll" component={CreatePollPage} />
      </Switch>
    );
  }
}

export default PollingApp;
