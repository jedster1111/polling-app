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

class NavBarContainer extends React.Component<NavBarContainerProps> {
  handleLogin = () => (window.location.href = "/auth/github");
  handleLogout = () => (window.location.href = "/auth/logout");
  navigateToPollForm = () => {
    console.log("navigating");
    this.props.discardPoll();
    this.props.navigateToPollForm();
  };
  render() {
    const location = this.props.location;
    return (
      <NavBar
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
