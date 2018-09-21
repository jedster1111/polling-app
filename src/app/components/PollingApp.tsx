import * as React from "react";
import { Route, Switch } from "react-router";
import styled from "styled-components";
import NavBar from "./NavBar";
import CreatePollPage from "./pages/CreatePollPage";
import HomePage from "./pages/HomePage";
import PollsListPage from "./pages/PollsListPage";

const StyledContainer = styled.div<{}>`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  align-items: flex-start;
  position: fixed;
  background-color: lightblue;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  background-color: #dff2d8;
  color: black;
  padding: 7px 10px;
  overflow: auto;
`;
const StyledPageContainer = styled.div<{}>`
  flex: 1;
  max-width: 1000px;
  min-width: 250px;
  /* padding: 5px 5px; */
`;

class PollingApp extends React.Component {
  render() {
    return (
      <StyledContainer>
        <NavBar />
        <Switch>
          <StyledPageContainer>
            <Route exact path="/" component={HomePage} />
            <Route path="/create-poll" component={CreatePollPage} />
            <Route path="/list-polls" component={PollsListPage} />
          </StyledPageContainer>
        </Switch>
      </StyledContainer>
    );
  }
}

export default PollingApp;
