import { ClientFunction, Role, Selector } from "testcafe";
import * as githubUser from "../../secret/githubTestAuth";

const getPageUrl = ClientFunction(() => window.location.href.toString());

export const githubTestUser = Role("localhost:8000/auth/github", async t => {
  await t
    .typeText("#login_field", githubUser.username)
    .typeText("#password", githubUser.password)
    .pressKey("enter");
  if (await Selector("#js-oauth-authorize-btn", { timeout: 10000 }).exists) {
    await t.wait(2000).click("#js-oauth-authorize-btn");
  }
  await t.expect(getPageUrl()).contains("127.0.0.1:8000", { timeout: 10000 });
  // TODO add check to see if succesfully logged in, eg is the login button still displayed?
});
