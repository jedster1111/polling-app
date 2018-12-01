import { Selector, t } from "testcafe";
import { ReactSelector } from "testcafe-react-selectors";

export default class Navbar {
  navBar = ReactSelector("NavBar");
  home = this.navBar.find("#homeLink");
  createPoll = this.navBar.find("#createPollLink");
  pollsList = this.navBar.find("#pollsListLink");
  loginButton = this.navBar.findReact("LoginButton").find("button");
  logoutButton = this.navBar.findReact("LogoutButton").find("button");
  editNamespaceButton = this.navBar.find(".edit-namespace-button");
  namespaceValue = this.navBar.find(".namespace-value");
  editNamespaceInput = Selector(".edit-namespace-input");

  async changeNamespace(namespace: string) {
    await t
      .click(this.editNamespaceButton)
      .typeText(this.editNamespaceInput, namespace, { replace: true })
      .pressKey("enter");
  }

  async checkNamespace(namespace: string) {
    await t.expect(this.namespaceValue.textContent).eql(`/${namespace}`);
  }
}
