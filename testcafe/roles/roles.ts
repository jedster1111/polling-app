// import * as githubUser from "../../secret/githubTestAuth";
import dotenv = require("dotenv");
import path = require("path");
import { Role, Selector } from "testcafe";

dotenv.config({ path: path.resolve(__dirname, "..", "..", "dev.env") });

const BASE_URL =
  `http://${process.env.TESTCAFE_IP}:8000` || "http://127.0.0.1:8000";

export const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;

// const getPageUrl = ClientFunction(() => window.location.href.toString());

export const githubTestUser = Role(`${BASE_URL}/auth/github`, async t => {
  await t
    .typeText("#login_field", username)
    .typeText("#password", password)
    .pressKey("enter");
  if (await Selector("#js-oauth-authorize-btn", { timeout: 10000 }).exists) {
    await t.wait(2000).click("#js-oauth-authorize-btn");
  }
  // await t.expect(getPageUrl()).contains("127.0.0.1:8000", { timeout: 10000 });
});
