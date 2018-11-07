import uuid = require("uuid/v1");
import { PollInput } from "../../src/app/types";
import CreatePollPage from "../pages/createPollPage";
import Navbar from "../pages/navbar";
import PollDetailPage, { IsOpenText } from "../pages/pollDetailPage";
import PollsListPage from "../pages/pollsListPage";
import { githubTestUser, username } from "../roles/roles";

const navbar = new Navbar();
const detailPage = new PollDetailPage();
const createPollPage = new CreatePollPage();
const pollsListPage = new PollsListPage();

async function createPoll(t: TestController, pollInput: PollInput) {
  await t.click(navbar.createPoll);
  await createPollPage.fillFormInputs(t, pollInput);
  await t.click(createPollPage.createPollButton).click(navbar.pollsList);
}

function userTotalVoteCounter() {
  let count = 0;
  return {
    addVote: (): number => {
      count++;
      return count;
    },
    removeVote: (): number => {
      count--;
      return count;
    },
    count
  };
}

fixture("Testing the poll detail page")
  .page("http://127.0.0.1:8000")
  .beforeEach(async t => {
    await t.useRole(githubTestUser);

    const id = uuid();
    const pollInput: PollInput = {
      pollName: id,
      description: "description",
      options: ["option1", "option2", "option3", "option4"],
      voteLimit: 5
    };

    t.ctx.id = id;
    t.ctx.pollInput = pollInput;

    await createPoll(t, pollInput);

    await t.click(pollsListPage.pollDetailButton(id));
  });

test("The created poll should have the correct information", async t => {
  const voteCounter = userTotalVoteCounter();
  const pollInput = t.ctx.pollInput as PollInput;
  await detailPage.checkValues({
    pollName: pollInput.pollName,
    username,
    description: pollInput.description,
    userVotes: voteCounter.count,
    voteLimit: pollInput.voteLimit.toString(),
    isOpenText: IsOpenText.open
  });
});
