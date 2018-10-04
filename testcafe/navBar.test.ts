import { ReactSelector } from "testcafe-react-selectors";
import Navbar from "./pages/navbar";
const navbar = new Navbar();

fixture("Can you navigate properly using the navbar?").page("localhost:8000");

test("Each nav link works", async t => {
  await t
    .click(navbar.createPoll)
    .expect(ReactSelector("CreatePollPage").exists)
    .ok("Create poll page isn't showing");
  await t
    .click(navbar.pollsList)
    .expect(ReactSelector("PollsListPage").exists)
    .ok("Polls list page isn't showing");
  await t
    .click(navbar.home)
    .expect(ReactSelector("HomePage").exists)
    .ok("Home page isn't showing");
});
