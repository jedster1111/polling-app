import { ReactSelector } from "testcafe-react-selectors";

export default class Navbar {
  navBar = ReactSelector("NavBar");
  home = this.navBar.find("#homeLink");
  createPoll = this.navBar.find("#createPollLink");
  pollsList = this.navBar.find("#pollsListLink");
  loginButton = this.navBar.findReact("LoginButton").find("button");
  logoutButton = this.navBar.findReact("LogoutButton").find("button");
}
