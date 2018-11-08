import uuid = require("uuid/v1");
import { PollInput } from "../../src/app/types";
import CreatePollPage from "../pages/createPollPage";
import Navbar from "../pages/navbar";
import PollDetailPage, {
  ExpectedValues,
  IsOpenText
} from "../pages/pollDetailPage";
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

fixture("Testing the poll detail page")
  .page("http://127.0.0.1:8000")
  .beforeEach(async t => {
    detailPage.resetVoteCount();

    await t.useRole(githubTestUser);

    const id = uuid();
    const pollInput: PollInput = {
      pollName: id,
      description: "description",
      options: ["option1", "option2", "option3", "option4"],
      voteLimit: 5
    };

    t.ctx.pollInput = pollInput;

    await createPoll(t, pollInput);

    await pollsListPage.clickDetailButton(id);
  });

test("The created poll should have the correct initial information", async t => {
  const pollInput = t.ctx.pollInput as PollInput;

  await detailPage.checkValues({
    pollName: pollInput.pollName,
    username,
    description: pollInput.description,
    userVotes: detailPage.voteCount,
    voteLimit: pollInput.voteLimit.toString(),
    isOpenText: IsOpenText.open,
    options: pollInput.options
  });
});

test("Can I vote and remove votes? Does it stop me from going over the limits?", async t => {
  const pollInput = t.ctx.pollInput as PollInput;
  const firstOption = detailPage.getOptionByIndex(0);
  const secondOption = detailPage.getOptionByIndex(1);
  const thirdOption = detailPage.getOptionByIndex(2);

  // click button max number of times
  await firstOption.clickVoteButton(pollInput.voteLimit);
  await firstOption.checkNumberOfVotesFromUser(pollInput.voteLimit);

  // click button once more, votes should stay the same
  await firstOption.clickVoteButton();
  await firstOption.checkNumberOfVotesFromUser(pollInput.voteLimit);

  // remove all votes
  await firstOption.clickRemoveVoteButton(pollInput.voteLimit);
  await firstOption.checkNumberOfVotesFromUser(0);

  // click once more, votes should still be 0
  await firstOption.clickRemoveVoteButton();
  await firstOption.checkNumberOfVotesFromUser(0);

  const secondOptionNumberOfClicks = pollInput.voteLimit - 2;

  // add two votes to first option and then hit the limit using the second option
  await firstOption.clickVoteButton(2);
  await secondOption.clickVoteButton(secondOptionNumberOfClicks);

  await firstOption.checkNumberOfVotesFromUser(2);
  await secondOption.checkNumberOfVotesFromUser(secondOptionNumberOfClicks);

  await secondOption.clickVoteButton();
  await secondOption.checkNumberOfVotesFromUser(secondOptionNumberOfClicks);

  // try to vote on third option, shouldn't work
  await thirdOption.clickVoteButton();
  await thirdOption.checkNumberOfVotesFromUser(0);

  await thirdOption.clickRemoveVoteButton();
  await thirdOption.checkNumberOfVotesFromUser(0);

  // remove a vote from number two, can I now add one to the third option?
  await secondOption.clickRemoveVoteButton();
  await thirdOption.clickVoteButton();

  await secondOption.checkNumberOfVotesFromUser(secondOptionNumberOfClicks - 1);
  await thirdOption.checkNumberOfVotesFromUser(1);
});
