import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Fragment } from "react";
import {
  LoginButton,
  LogoutButton
} from "../src/app/components/login-form/AuthButtons";
import UserDataForm from "../src/app/components/user-data-form/UserDataForm";
import { mockSubmit } from "./index.stories";

storiesOf("User Data Form", module)
  .add("NameForm", () => (
    <UserDataForm
      handleChange={action("Input changed")}
      discardChanges={action("Discarded changes")}
      handleSubmit={mockSubmit}
      values={{ name: "Jed" }}
    />
  ))
  .add("Login and Logout with Github Buttons", () => (
    <Fragment>
      <LoginButton handleLogin={action("Logged In")} />
      <LogoutButton handleLogout={action("Logged Out")} />
    </Fragment>
  ));
