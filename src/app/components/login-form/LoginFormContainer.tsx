import * as React from "react";
import { connect } from "react-redux";
import { InitialState } from "../../reducers/rootReducer";
import { User } from "../../types";
import LoginForm from "./LoginForm";

interface LoginFormContainerProps {
  userData: User;
  isLoggedIn: boolean;
}

const mapStateToProps = (state: InitialState) => ({
  userData: state.userState.data,
  isLoggedIn: state.userState.isLoggedIn
});

class LoginFormContainer extends React.Component<LoginFormContainerProps> {
  handleLogin = () => {
    window.location.href = "/auth/github";
  };
  handleLogout = () => {
    window.location.href = "/auth/logout";
  };
  render() {
    return (
      <LoginForm
        handleLogin={this.handleLogin}
        handleLogout={this.handleLogout}
        isLoggedIn={this.props.isLoggedIn}
        userData={this.props.userData}
      />
    );
  }
}

const ConnectedLoginForm = connect(mapStateToProps)(LoginFormContainer);

export default ConnectedLoginForm;
