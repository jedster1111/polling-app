import * as React from "react";
import { connect, MapStateToProps } from "react-redux";
import { StoreState } from "../../reducers/rootReducer";
import { User } from "../../types";
import NavBar from "./Navbar";

// import * as React from "react";

interface StateProps {
  userData: User;
  isLoggedIn: boolean;
  location: string;
  isLoading: boolean;
}

type NavBarContainerProps = StateProps;

const mapStateToProps: MapStateToProps<StateProps, {}, StoreState> = state => ({
  isLoading: state.userState.isLoading,
  isLoggedIn: state.userState.isLoggedIn,
  userData: state.userState.data,
  location: state.router.location.pathname
});

class NavBarContainer extends React.Component<NavBarContainerProps> {
  handleLogin = () => (window.location.href = "/auth/github");
  handleLogout = () => (window.location.href = "/auth/logout");
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
      />
    );
  }
}

const ConnectedNavBarContainer = connect(mapStateToProps)(NavBarContainer);

export default ConnectedNavBarContainer;
