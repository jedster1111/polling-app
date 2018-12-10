import { Selector, t } from "testcafe";

export default class Navbar {
  navBar = Selector(".navbar");
  home = this.navBar.find("#homeLink");
  createPoll = this.navBar.find("#createPollLink");
  pollsList = this.navBar.find("#pollsListLink");
  loginButton = this.navBar.find(".loginButton").find("button");
  logoutButton = this.navBar.find(".logoutButton").find("button");
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
