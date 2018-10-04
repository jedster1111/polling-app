import { PollInput } from "../src/app/types";
import Page from "./pages/createPollPage";
import { githubTestUser } from "./roles/roles";

const page = new Page();

const defaultPollInput: PollInput = {
  pollName: "pollName",
  description: "description",
  options: ["option1", "option2", "option3", "option4"]
};

const typeText = async (t: TestController, input: Selector, text: string) => {
  text
    ? await t.typeText(input, text, { replace: true })
    : await t.selectText(input).pressKey("delete");
};

const fillFormInputs = async (t: TestController, pollInput: PollInput) => {
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
  // need to use this as foreach loop doesn't hadnle async callbacks!
  for (const [index, option] of pollInput.options.entries()) {
    await checkInput(t, page.optionInputs.nth(index), option);
  }
};

// const removeOption = (t: TestController, index: number) => await t.click(page.removeOptionButton(index))

fixture("Testing the create a poll form").page(
  "http://127.0.0.1:8000/create-poll"
);
test.only("If I'm not logged in submitting the form should result in no changes", async t => {
  await fillFormInputs(t, defaultPollInput);
  await t.pressKey("enter");
  await checkFormInputs(t, defaultPollInput);
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

  // Empty options
  let pollInput = deepCopyPollInput();
  pollInput.options = [];
  await fillFormInputs(t, pollInput);
  await t.pressKey("enter");
  await checkFormInputs(t, pollInput);

  // Empty pollName
  pollInput = deepCopyPollInput();
  pollInput.pollName = "";
  await fillFormInputs(t, pollInput);
  await t.pressKey("enter");
  await checkFormInputs(t, pollInput);

  // Empty description
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

test.only("Should be able to add and remove options", async t => {
  // Remove options
  await fillFormInputs(t, defaultPollInput);
  await t.click(page.removeOptionButton(0)).click(page.removeOptionButton(0));
  await t
    .expect(page.removeOptionButtons.count)
    .eql(2)
    .expect(page.optionInputs.nth(0).value)
    .eql(defaultPollInput.options[2])
    .expect(page.optionInputs.nth(1).value)
    .eql(defaultPollInput.options[3]);

  const newInputs = ["newOption1", "newOption2"];

  await t.click(page.addOptionButton).click(page.addOptionButton);
  await t
    .typeText(page.optionInputs.nth(2), newInputs[0])
    .typeText(page.optionInputs.nth(3), newInputs[1]);

  await checkFormInputs(t, {
    ...defaultPollInput,
    options: [
      defaultPollInput.options[2],
      defaultPollInput.options[3],
      ...newInputs
    ]
  });

  // await t.click(page.removeOptionButton(0));
  // await checkFormInputs(t, {
  //   ...defaultPollInput,
  //   options: [defaultPollInput[2], defaultPollInput[3], newInputs[1]]
  // });
});
