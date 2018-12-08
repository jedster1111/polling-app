import { Role } from "testcafe";
import uuid = require("uuid/v1");
import { PollInput } from "../../src/app/types";
import CreatePollPage from "../pages/createPollPage";
import Navbar from "../pages/navbar";
import PollDetailPage, { IsOpenText } from "../pages/pollDetailPage";
import PollsListPage from "../pages/pollsListPage";
import { githubTestUser, username } from "../roles/roles";

const BASE_URL =
  `http://${process.env.TESTCAFE_IP}:8000` || "http://127.0.0.1:8000";

enum OptionText {
  b = "banana",
  d = "deer",
  c = "carrot",
  a = "apple"
}

const optionsInDefaultOrder = [
  OptionText.b,
  OptionText.d,
  OptionText.c,
  OptionText.a
];

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
  .page(BASE_URL)
  .beforeEach(async t => {
    await t.useRole(githubTestUser);

    const id = uuid();
    const pollInput: PollInput = {
      pollName: id,
      description: "description",
      options: [
        { value: "option1" },
        { value: "option2" },
        { value: "option3" },
        { value: "option4" }
      ],
      voteLimit: 5,
      optionVoteLimit: 5
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
      { value: "option1 changed" },
      { value: "option2 changed" },
      { value: "option3 changed" },
      { value: "option4 changed" }
    ],
    voteLimit: 4,
    optionVoteLimit: 4
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

  editedPollInput.options.push({ value: newOptionText });
  editedPollInput.options[0] = { value: "" };

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

  // shouldn't be able to vote again as should be at max votes
  await newOption.clickVoteButton();
  await newOption.checkNumberOfVotesFromUser(1);
});

test("Can I sort alphabetically, by # of votes and by if you've voted or not", async t => {
  async function checkOptionValues(values: OptionText[]) {
    await t.expect(detailPage.options.count).eql(values.length);
    for (const [index, value] of values.entries()) {
      await t
        .expect(detailPage.getOptionByIndex(index).optionValue.textContent)
        .eql(value);
    }
  }

  const pollInput = t.ctx.pollInput as PollInput;

  const optionA = detailPage.getOptionByText(OptionText.a);
  const optionB = detailPage.getOptionByText(OptionText.b);
  const optionC = detailPage.getOptionByText(OptionText.c);
  const optionD = detailPage.getOptionByText(OptionText.d);

  const optionsInAlphabeticalOrder = [
    OptionText.a,
    OptionText.b,
    OptionText.c,
    OptionText.d
  ];
  const optionsInReverseAlphabeticalOrder = [
    OptionText.d,
    OptionText.c,
    OptionText.b,
    OptionText.a
  ];

  const optionsInVotedOrder = optionsInDefaultOrder.filter(
    option => option !== OptionText.d
  );
  optionsInVotedOrder.push(OptionText.d);

  const optionsInReverseVotedOrder = optionsInDefaultOrder.filter(
    option => option !== OptionText.d
  );
  optionsInReverseVotedOrder.unshift(OptionText.d);

  const headers = detailPage.getHeaders();

  await optionA.clickVoteButton(3);
  await optionB.clickVoteButton(2);
  await optionC.clickVoteButton(1);

  // Sort by number of votes and check
  await t.click(headers.votesHeader);
  await checkOptionValues(optionsInAlphabeticalOrder);

  // Sort by reverse number of votes and check
  await t.click(headers.votesHeader);
  await checkOptionValues(optionsInReverseAlphabeticalOrder);

  // Can I go back to default by clicking a third time?
  await t.click(headers.votesHeader);
  await checkOptionValues(optionsInDefaultOrder);

  // Sort into alphabetical order
  await t.click(headers.optionHeader);
  await checkOptionValues(optionsInAlphabeticalOrder);

  // Sort into reverse alphabetical order
  await t.click(headers.optionHeader);
  await checkOptionValues(optionsInReverseAlphabeticalOrder);

  // Go back to default order
  await t.click(headers.optionHeader);
  await checkOptionValues(optionsInDefaultOrder);

  // Sort by voted
  await t.click(headers.votedHeader);
  await checkOptionValues(optionsInVotedOrder);

  // Sort by reverse voted
  await t.click(headers.votedHeader);
  await checkOptionValues(optionsInReverseVotedOrder);

  // Return back to default
  await t.click(headers.votedHeader);
  await checkOptionValues(optionsInDefaultOrder);
}).before(async t => {
  await t.useRole(githubTestUser);

  const id = uuid();
  const pollInput: PollInput = {
    pollName: id,
    description: "description",
    options: optionsInDefaultOrder.map(optionText => ({ value: optionText })),
    voteLimit: 6,
    optionVoteLimit: 6
  };

  t.ctx.pollInput = pollInput;

  await createPoll(t, pollInput);

  await pollsListPage.clickDetailButton(id);
});

test("If I edit a poll and give it a new namespace, I will get automatically redirected to the new location", async t => {
  const editedPollInput: PollInput = {
    description: "descriptionChanged",
    pollName: "pollNameChanged",
    options: [
      { value: "option1 changed" },
      { value: "option2 changed" },
      { value: "option3 changed" },
      { value: "option4 changed" }
    ],
    voteLimit: 4,
    optionVoteLimit: 4,
    namespace: "changed-room"
  };

  await t.click(detailPage.actionButtons.editButton);
  await createPollPage.fillFormInputs(t, editedPollInput);
  await t.click(createPollPage.createPollButton);

  await navbar.checkNamespace("changed-room");
});
