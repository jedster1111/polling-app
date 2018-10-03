import { Role } from "testcafe";
import * as githubUser from "../../secret/githubTestAuth";

export const githubTestUser = Role("localhost:8000/auth/github", async t => {
  await t
    .typeText("#login_field", githubUser.username)
    .typeText("#password", githubUser.password)
    .pressKey("enter");
});
