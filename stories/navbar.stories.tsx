import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
// import { Menu } from "antd";
import "antd/dist/antd.css";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";
import {
  LoginButton,
  LogoutButton
} from "../src/app/components/login-form/AuthButtons";
import Navbar from "../src/app/components/navbar/Navbar";

const userData = {
  id: "1",
  photos: [{ value: "https://avatars2.githubusercontent.com/u/25291974?v=4" }],
  userName: "Jed"
};
storiesOf("Navbar", module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={["/"]}>{story()}</MemoryRouter>
  ))
  .add("Login/Logout Button", () => (
    <React.Fragment>
      <LoginButton handleLogin={loggedIn()} />
      <LogoutButton handleLogout={loggedOut()} />
    </React.Fragment>
  ))
  .add("Navbar", () => (
    <React.Fragment>
      <Navbar
        isLoggedIn={false}
        userData={userData}
        handleLogin={loggedIn()}
        handleLogout={loggedOut()}
      />
      <Navbar
        isLoggedIn={true}
        userData={userData}
        handleLogin={loggedIn()}
        handleLogout={loggedOut()}
      />
    </React.Fragment>
  ));

function loggedOut(): () => void {
  return action("Logged  out!");
}
function loggedIn(): () => void {
  return action("Logged in!");
}
