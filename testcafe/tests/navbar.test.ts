import { Selector } from "testcafe";
import Navbar from "../pages/navbar";
import { githubTestUser } from "../roles/roles";
const navbar = new Navbar();

const BASE_URL = process.env.TESTCAFE_URL || "http://127.0.0.1:8000";

fixture("Can you navigate properly using the navbar?").page(BASE_URL);

test("Each nav link works", async t => {
  await t.useRole(githubTestUser);

  await t
    .click(navbar.createPoll)
    .expect(Selector("#createPollForm").exists)
    .ok("Create poll page isn't showing");

  await t
    .click(navbar.pollsList)
    .expect(Selector(".pollsListPage").exists)
    .ok("Polls list page isn't showing");
});

test("namespace display works", async t => {
  await navbar.checkNamespace("public");

  await navbar.changeNamespace("jed room");
  await navbar.checkNamespace("jed-room");
});
