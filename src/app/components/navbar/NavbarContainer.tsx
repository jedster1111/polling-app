import * as React from "react";
import { connect, MapStateToProps } from "react-redux";
import { InitialState } from "../../reducers/rootReducer";
import { User } from "../../types";
import NavBar from "./Navbar";

// import * as React from "react";

interface OwnProps {}
interface StateProps {
  userData: User;
  isLoggedIn: boolean;
}

type NavBarContainerProps = OwnProps & StateProps;

const mapStateToProps: MapStateToProps<
  StateProps,
  OwnProps,
  InitialState
> = state => ({
  isLoggedIn: state.userState.isLoggedIn,
  userData: state.userState.data
});

class NavBarContainer extends React.Component<NavBarContainerProps> {
  handleLogin = () => (window.location.href = "/auth/github");
  handleLogout = () => (window.location.href = "/auth/logout");
  render() {
    return (
      <NavBar
        isLoggedIn={this.props.isLoggedIn}
        userData={this.props.userData}
        handleLogin={this.handleLogin}
        handleLogout={this.handleLogout}
      />
    );
  }
}

const ConnectedNavBarContainer = connect(mapStateToProps)(NavBarContainer);

export default ConnectedNavBarContainer;
