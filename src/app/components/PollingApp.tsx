import { Layout } from "antd";
import { ConnectedRouter } from "connected-react-router";
import * as React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router";
import { closedWarning, getUserData } from "../actions/actions";
import { InitialState } from "../reducers/rootReducer";
import { history } from "../store/index";
import "./antd-main-override.css";
import NavBar from "./navbar/NavbarContainer";
import CreatePollPage from "./pages/CreatePollPage";
import PollDetailPage from "./pages/PollDetailPage";
// import HomePage from "./pages/HomePage";
import PollsListPage from "./pages/PollsListPage";

const { Header, Content, Footer } = Layout;

interface PollingAppProps {
  getUserData: () => any;
  closedWarning: () => any;
  isLoggedIn: boolean;
  hasClosedWarning: boolean;
}
const mapStateToProps = (state: InitialState) => ({
  isLoggedIn: state.userState.isLoggedIn,
  hasClosedWarning: state.userState.hasClosedWarning
});
const mapDispatchToProps = {
  getUserData,
  closedWarning
};
class PollingApp extends React.Component<PollingAppProps> {
  componentDidMount() {
    this.props.getUserData();
  }
  handleLogin = () => {
    window.location.href = "/auth/github";
  };
  handleLogout = () => {
    window.location.href = "/auth/logout";
  };
  render() {
    return (
      <ConnectedRouter history={history}>
        <Layout style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Header style={{ background: "#fff" }}>
            <NavBar />
          </Header>
          <Content>
            <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
              <Switch>
                <Route
                  path="/"
                  exact
                  component={() => (
                    <PollsListPage
                      hasClosedWarning={this.props.hasClosedWarning}
                      onClosedWarning={this.props.closedWarning}
                    />
                  )}
                />
                <Route
                  exact
                  path="/:namespace"
                  component={() => (
                    <PollsListPage
                      hasClosedWarning={this.props.hasClosedWarning}
                      onClosedWarning={this.props.closedWarning}
                    />
                  )}
                />
                <Route
                  path="/:namespace/create-poll"
                  component={CreatePollPage}
                />
                <Route path="/:namespace/:id" component={PollDetailPage} />
              </Switch>
            </div>
          </Content>
          <Footer />
        </Layout>
      </ConnectedRouter>
    );
  }
}
const ConnectedPollingApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollingApp);

export default ConnectedPollingApp;
