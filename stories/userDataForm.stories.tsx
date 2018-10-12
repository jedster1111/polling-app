import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Fragment } from "react";
import {
  LoginButton,
  LogoutButton
} from "../src/app/components/login-form/AuthButtons";

storiesOf("User Data Form", module).add(
  "Login and Logout with Github Buttons",
  () => (
    <Fragment>
      <LoginButton handleLogin={action("Logged In")} />
      <LogoutButton handleLogout={action("Logged Out")} />
    </Fragment>
  )
);
