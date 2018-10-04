import { PollInput } from "../src/app/types";
import Page from "./pages/createPollPage";
import { githubTestUser } from "./roles/roles";

const page = new Page();

const defaultPollInput: PollInput = {
  pollName: "pollName",
  description: "description",
  options: ["option1", "option2", "option3"]
};

const typeText = async (t: TestController, input: Selector, text: string) => {
  text
    ? await t.typeText(input, text, { replace: true })
    : await t.selectText(input).pressKey("delete");
};

const fillFormInputs = async (t: TestController, pollInput: PollInput) => {
  // await t
  //   .typeText(page.pollNameInput, pollInput.pollName, { replace: true })
  //   .typeText(page.descriptionInput, pollInput.description, { replace: true });
  await typeText(t, page.pollNameInput, pollInput.pollName);
  await typeText(t, page.descriptionInput, pollInput.description);
  pollInput.options.forEach(
    async (option, index) =>
      await typeText(t, page.optionInputs.nth(index), option)
  );
};

const checkInput = async (t: TestController, input: Selector, value: string) =>
  await t.expect(input.value).eql(value);
const checkFormInputs = async (t: TestController, pollInput: PollInput) => {
  await checkInput(t, page.pollNameInput, pollInput.pollName);
  await checkInput(t, page.descriptionInput, pollInput.description);
  pollInput.options.forEach(
    async (option, index) =>
      await checkInput(t, page.optionInputs.nth(index), option)
  );
};

fixture("Testing the create a poll form").page(
  "http://127.0.0.1:8000/create-poll"
);
test("If I'm not logged in submitting the form should result in no changes", async t => {
  await fillFormInputs(t, defaultPollInput);
  await t.pressKey("enter");
  checkFormInputs(t, defaultPollInput);
});

test("When a poll is submitted succesfully, the text inputs should reset", async t => {
  await t.useRole(githubTestUser);
  await fillFormInputs(t, defaultPollInput);
  await t.pressKey("enter");
  await t.expect(page.allInputs.value).eql("");
});

test("Trying to submit a poll with empty fields should result in no change", async t => {
  const deepCopyPollInput = (): PollInput => ({
    ...defaultPollInput,
    options: [...defaultPollInput.options]
  });

  await t.useRole(githubTestUser);

  let pollInput = deepCopyPollInput();
  pollInput.options = [];
  await fillFormInputs(t, pollInput);
  await t.pressKey("enter");
  await checkFormInputs(t, pollInput);

  pollInput = deepCopyPollInput();
  pollInput.pollName = "";
  await fillFormInputs(t, pollInput);
  await t.pressKey("enter");
  await checkFormInputs(t, pollInput);

  pollInput = deepCopyPollInput();
  pollInput.description = "";
  await fillFormInputs(t, pollInput);
  await t.pressKey("enter");
  await checkFormInputs(t, pollInput);
});

test("Clicking the discard button should reset all the fields", async t => {
  await fillFormInputs(t, defaultPollInput);
  await t.click(page.discardPollButton);
  await t.expect(page.allInputs.value).eql("");
});
