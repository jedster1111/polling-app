import { ReactSelector } from "testcafe-react-selectors";
import Navbar from "../pages/navbar";
import { githubTestUser } from "../roles/roles";
const navbar = new Navbar();

const BASE_URL =
  `http://${process.env.TESTCAFE_IP}:8000` || "http://127.0.0.1:8000";

fixture("Can you navigate properly using the navbar?").page(BASE_URL);

test("Each nav link works", async t => {
  await t.useRole(githubTestUser);

  await t
    .click(navbar.createPoll)
    .expect(ReactSelector("CreatePollPage").exists)
    .ok("Create poll page isn't showing");

  await t
    .click(navbar.pollsList)
    .expect(ReactSelector("PollsListPage").exists)
    .ok("Polls list page isn't showing");
});

test("namespace display works", async t => {
  await navbar.checkNamespace("public");

  await navbar.changeNamespace("jed room");
  await navbar.checkNamespace("jed-room");
});
