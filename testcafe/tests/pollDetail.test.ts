import { Role } from "testcafe";
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
    userVotes: 0,
    voteLimit: pollInput.voteLimit,
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

  // Shouldn't be able to vote again on the second option
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

test("Can I close a poll, not be able to vote, then re-open it and vote again?", async () => {
  const firstOption = detailPage.getOptionByIndex(0);

  // cast a vote and then close the poll
  await firstOption.clickVoteButton();
  await detailPage.clickOpenButton();

  // does the correct text display and am I unable to cast or remove votes?
  await detailPage.checkIsOpenText(false);
  await firstOption.clickVoteButton();
  await firstOption.checkNumberOfVotesFromUser(1);

  await firstOption.clickRemoveVoteButton();
  await firstOption.checkNumberOfVotesFromUser(1);

  // Re-open the poll and then I can vote again?
  await detailPage.clickOpenButton();
  await detailPage.checkIsOpenText(true);

  await firstOption.clickRemoveVoteButton();
  await firstOption.checkNumberOfVotesFromUser(0);
});

test("If I'm not logged in, I can't vote and I won't see any action buttons", async t => {
  const firstOption = detailPage.getOptionByIndex(0);

  // log out and then check that the action buttons aren't visible
  await t.useRole(Role.anonymous());
  await detailPage.checkActionButtons("notVisible");

  await firstOption.clickVoteButton();
  await firstOption.checkNumberOfVotesFromUser(0);

  // login
  await t.useRole(githubTestUser);
  await detailPage.checkActionButtons("isVisible");

  await firstOption.clickVoteButton();
  await firstOption.checkNumberOfVotesFromUser(1);
});

test(`Can I edit a poll, will it not lose my votes?
  Can I delete an option?
  Can I hit the limit of votes and then reduce voteLimit and then remove votes?`, async t => {
  const pollInput = t.ctx.pollInput as PollInput;
  const editedPollInput: PollInput = {
    description: "descriptionChanged",
    pollName: "pollNameChanged",
    options: [
      "option1 changed",
      "option2 changed",
      "option3 changed",
      "option4 changed"
    ],
    voteLimit: 4
  };

  const firstOption = detailPage.getOptionByIndex(0);
  const secondOption = detailPage.getOptionByIndex(1);
  const thirdOption = detailPage.getOptionByIndex(2);

  // Cast maximum votes, edit poll and verfiy values have changed
  const firstOptionVotes = 2;
  const secondOptionVotes = pollInput.voteLimit - firstOptionVotes;

  await firstOption.clickVoteButton(firstOptionVotes);
  await secondOption.clickVoteButton(secondOptionVotes);

  await t.click(detailPage.actionButtons.editButton);
  await createPollPage.fillFormInputs(t, editedPollInput);
  await t.click(createPollPage.createPollButton);

  await detailPage.checkValues({
    pollName: editedPollInput.pollName,
    description: editedPollInput.description,
    options: editedPollInput.options,
    voteLimit: editedPollInput.voteLimit,
    isOpenText: IsOpenText.open,
    userVotes: pollInput.voteLimit,
    username
  });

  // I should be unable to add a vote but I can remove some existing votes and then vote again
  await firstOption.clickVoteButton();
  await firstOption.checkNumberOfVotesFromUser(firstOptionVotes);

  await secondOption.clickVoteButton();
  await secondOption.checkNumberOfVotesFromUser(secondOptionVotes);

  await firstOption.clickRemoveVoteButton(2);

  await thirdOption.clickVoteButton();
  await thirdOption.checkNumberOfVotesFromUser(1);

  // Edit again
  await t.click(detailPage.actionButtons.editButton);

  // remove first option and then add a new one
  const newOptionText = "new option";
  await t.click(createPollPage.removeOptionButton(0));
  await t.click(createPollPage.addOptionButton);
  await t.typeText(createPollPage.optionInputs.nth(4), newOptionText);

  editedPollInput.options.push(newOptionText);
  editedPollInput.options[0] = "";

  await createPollPage.fillFormInputs(t, editedPollInput);

  editedPollInput.options.shift();

  await t.click(createPollPage.createPollButton);

  // userVotes should be at maximum votes at the moment
  await detailPage.checkValues({
    pollName: editedPollInput.pollName,
    description: editedPollInput.description,
    options: editedPollInput.options,
    voteLimit: editedPollInput.voteLimit,
    isOpenText: IsOpenText.open,
    userVotes: editedPollInput.voteLimit,
    username
  });

  // remove vote from first option and add to the new one
  const newOption = detailPage.getOptionByText(newOptionText);
  await firstOption.clickRemoveVoteButton();
  await newOption.clickVoteButton();
  await newOption.checkNumberOfVotesFromUser(1);
});
