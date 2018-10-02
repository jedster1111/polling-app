import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Fragment } from "react";
import {
  LoginButton,
  LogoutButton
} from "../src/app/components/login-form/AuthButtons";
import LoginForm from "../src/app/components/login-form/LoginForm";

storiesOf("Login Form", module)
  .add("Auth Buttons", () => (
    <Fragment>
      <LoginButton handleLogin={action("Logged in!")} />
      <LogoutButton handleLogout={action("Logged out!")} />
    </Fragment>
  ))
  .add("LoginForm", () => (
    <Fragment>
      <LoginForm
        handleLogin={action("Logged in!")}
        handleLogout={action("Logged out!")}
        isLoggedIn={false}
        userData={null}
      />
      <LoginForm
        handleLogin={action("Logged in!")}
        handleLogout={action("Logged out!")}
        isLoggedIn={true}
        userData={{ id: "1", displayName: "Jed" }}
      />
    </Fragment>
  ));
