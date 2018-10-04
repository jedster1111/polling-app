import { ClientFunction, Role, Selector } from "testcafe";
import * as githubUser from "../../secret/githubTestAuth";

const getPageUrl = ClientFunction(() => window.location.href.toString());

export const githubTestUser = Role("localhost:8000/auth/github", async t => {
  await t
    .typeText("#login_field", githubUser.username)
    .typeText("#password", githubUser.password)
    .pressKey("enter");
  if (await Selector("#js-oauth-authorize-btn").exists) {
    await t.click("#js-oauth-authorize-btn");
  } else {
    await t.expect(getPageUrl()).contains("127.0.0.1:8000", { timeout: 10000 });
  }
});
