import { Button, Icon } from "antd";
import * as React from "react";

interface LoginButtonProps {
  handleLogin: () => void;
}
interface LogoutButtonProps {
  handleLogout: () => void;
}

export const LoginButton: React.SFC<LoginButtonProps> = props => (
  <Button onClick={props.handleLogin}>
    Login
    <Icon type="github" />
  </Button>
);
export const LogoutButton: React.SFC<LogoutButtonProps> = props => (
  <Button onClick={props.handleLogout} type="danger">
    Logout
  </Button>
);
LoginButton.displayName = "LoginButton";
LogoutButton.displayName = "LogoutButton";
