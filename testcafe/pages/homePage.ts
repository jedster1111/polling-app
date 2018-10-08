import { ReactSelector } from "testcafe-react-selectors";

export default class HomePage {
  loginButton = ReactSelector("LoginButton").find("button");
  logoutButton = ReactSelector("LogoutButton").find("button");
}
