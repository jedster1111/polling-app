import { Role } from "testcafe";
import uuid = require("uuid/v1");
import { PollInput } from "../../src/app/types";
import CreatePollPage from "../pages/createPollPage";
import Navbar from "../pages/navbar";
import PollsListPage from "../pages/pollsListPage";
import { githubTestUser } from "../roles/roles";

const BASE_URL = `${process.env.TESTCAFE_URL}` || "http://127.0.0.1:8000";

const navbar = new Navbar();
const createPollPage = new CreatePollPage();
const pollsListPage = new PollsListPage();

const createPoll = async (t: TestController, pollInput: PollInput) => {
  await t.click(navbar.createPoll);
  await createPollPage.fillFormInputs(t, pollInput);
  await t.click(createPollPage.createPollButton).click(navbar.pollsList);
};
const createPollInput = (): PollInput => ({
  // uses pollName as a unique identifier
  pollName: uuid(),
  description: "pollListDescriptionTest",
  options: [
    { value: "option1" },
    { value: "option2" },
    { value: "option3" },
    { value: "option4" }
  ],
  voteLimit: 1,
  optionVoteLimit: 1
});

fixture("Testing the polls list page").page(BASE_URL);

test("Can I create a poll, then see it in the list of polls?", async t => {
  await t.useRole(githubTestUser);

  const pollInput = createPollInput();

  await createPoll(t, pollInput);

  await pollsListPage.checkCreatedPoll(pollInput.pollName, pollInput);
});

test("If I create polls in different namespaces I only see polls in that namespace?", async t => {
  await t.useRole(githubTestUser);

  const pollInput1 = createPollInput();
  const pollInput2 = createPollInput();

  pollInput2.namespace = "jed room";

  await createPoll(t, pollInput1);
  await createPoll(t, pollInput2);

  await pollsListPage.checkCreatedPoll(pollInput2.pollName, pollInput2);

  await navbar.changeNamespace("public");

  await pollsListPage.checkCreatedPoll(pollInput1.pollName, pollInput1);
});
test("I can't delete or edit polls if I'm not logged in", async t => {
  await t.useRole(githubTestUser);

  const pollInput = createPollInput();
  await createPoll(t, pollInput);

  await t.useRole(Role.anonymous());

  await t
    .expect(pollsListPage.pollCards.findReact("EditButton").exists)
    .notOk("You shouldn't see any edit buttons if not logged in");

  await t
    .expect(pollsListPage.pollCards.findReact("DeletePollButton").exists)
    .notOk("You shouldn't see any remove poll buttons");
});

test("I can delete a poll that I created", async t => {
  await t.useRole(githubTestUser);

  const pollInput = createPollInput();
  await createPoll(t, pollInput);

  // TODO Check that all polls with my name have edit and delete buttons instead of just the most recent
  await t
    .expect(pollsListPage.pollDeleteButton(pollInput.pollName).exists)
    .ok("You should see a delete button")
    .expect(pollsListPage.pollEditButton(pollInput.pollName).exists)
    .ok("You should see an edit button");

  await t.click(pollsListPage.pollDeleteButton(pollInput.pollName)).wait(5000);

  await t
    .expect(pollsListPage.getPollCard(pollInput.pollName).exists)
    .notOk("Poll should be deleted");
});
