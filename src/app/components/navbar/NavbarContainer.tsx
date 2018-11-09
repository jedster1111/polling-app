import * as React from "react";
import { connect } from "react-redux";
import { StoreState } from "../../reducers/rootReducer";
import { User } from "../../types";

import { discardPoll, navigateToPollForm } from "../../actions/actions";
import NavBar from "./Navbar";
// import * as React from "react";

interface StateProps {
  userData: User;
  isLoggedIn: boolean;
  location: string;
  isLoading: boolean;
}
interface DispatchProps {
  navigateToPollForm: () => any;
  discardPoll: () => any;
}

type NavBarContainerProps = StateProps & DispatchProps;

interface State {
  windowWidth: number;
}

const mapStateToProps: (state: StoreState) => StateProps = state => ({
  isLoading: state.userState.isLoading,
  isLoggedIn: state.userState.isLoggedIn,
  userData: state.userState.data,
  location: state.router.location.pathname
});

const mapDispatchToProps: DispatchProps = {
  navigateToPollForm,
  discardPoll
};

class NavBarContainer extends React.Component<NavBarContainerProps, State> {
  state = {
    windowWidth: document.body.clientWidth
  };

  handleResize = () => {
    this.setState({
      windowWidth: document.body.clientWidth
    });
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    setTimeout(this.handleResize, 1000);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleLogin = () => (window.location.href = "/auth/github");
  handleLogout = () => (window.location.href = "/auth/logout");
  navigateToPollForm = () => {
    this.props.discardPoll();
    this.props.navigateToPollForm();
  };
  render() {
    const location = this.props.location;
    return (
      <NavBar
        layout={this.state.windowWidth > 500 ? "horizontal" : "inline"}
        isLoading={this.props.isLoading}
        isLoggedIn={this.props.isLoggedIn}
        userData={this.props.userData}
        handleLogin={this.handleLogin}
        handleLogout={this.handleLogout}
        location={location}
        navigateToPollForm={this.navigateToPollForm}
      />
    );
  }
}

const ConnectedNavBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBarContainer);

export default ConnectedNavBarContainer;
