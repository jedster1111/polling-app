import { Button, Icon } from "antd";
import * as React from "react";

export const GithubLoginButton: React.SFC<{ handleClick: () => void }> = ({
  handleClick
}) => (
  <Button onClick={handleClick} className="githubLoginButton">
    Github
    <Icon type="github" />
  </Button>
);

export const GoogleLoginButton: React.SFC<{ handleClick: () => void }> = ({
  handleClick
}) => (
  <Button onClick={handleClick} className="googleLoginButton">
    Google
    <Icon type="google" />
  </Button>
);

export const LogoutButton: React.SFC<{ handleClick: () => void }> = ({
  handleClick
}) => (
  <Button onClick={handleClick} className="logoutButton">
    Logout
  </Button>
);
