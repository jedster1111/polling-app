import { PollInput } from "../../src/app/types";
import Page from "../pages/createPollPage";
import { githubTestUser } from "../roles/roles";

const page = new Page();

const defaultPollInput: PollInput = {
  pollName: "pollName",
  description: "description",
  options: ["option1", "option2", "option3", "option4"]
};

fixture("Testing the create a poll form").page(
  "http://127.0.0.1:8000/create-poll"
);

test("When a poll is submitted succesfully, the text inputs should reset", async t => {
  await t.useRole(githubTestUser);
  await page.fillFormInputs(t, defaultPollInput);
  await t.click(page.createPollButton);
  await t.expect(page.allInputs.value).eql("");
});

test("If I'm not logged in submitting the form should result in no changes", async t => {
  await page.fillFormInputs(t, defaultPollInput);
  await t.click(page.createPollButton);
  await page.checkFormInputs(t, defaultPollInput);
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
  await page.fillFormInputs(t, pollInput);
  await t.click(page.createPollButton);
  await page.checkFormInputs(t, pollInput);

  // Empty pollName
  pollInput = deepCopyPollInput();
  pollInput.pollName = "";
  await page.fillFormInputs(t, pollInput);
  await t.click(page.createPollButton);
  await page.checkFormInputs(t, pollInput);

  // Empty description
  pollInput = deepCopyPollInput();
  pollInput.description = "";
  await page.fillFormInputs(t, pollInput);
  await t.click(page.createPollButton);
  await page.checkFormInputs(t, pollInput);
});

test("Clicking the discard button should reset all the fields", async t => {
  await page.fillFormInputs(t, defaultPollInput);
  await t.click(page.discardPollButton);
  await t.expect(page.allInputs.value).eql("");
});

test("Should be able to add and remove options", async t => {
  // Remove options first 2 options
  await page.fillFormInputs(t, defaultPollInput);
  await t.click(page.removeOptionButton(0)).click(page.removeOptionButton(0));
  await t
    .expect(page.removeOptionButtons.count)
    .eql(2)
    .expect(page.optionInputs.nth(0).value)
    .eql(defaultPollInput.options[2])
    .expect(page.optionInputs.nth(1).value)
    .eql(defaultPollInput.options[3]);

  const newInputs = ["newOption1", "newOption2"];

  // Add two new options and fill with text
  await t.click(page.addOptionButton).click(page.addOptionButton);
  await t
    .typeText(page.optionInputs.nth(2), newInputs[0])
    .typeText(page.optionInputs.nth(3), newInputs[1]);
  await page.checkFormInputs(t, {
    ...defaultPollInput,
    options: [
      defaultPollInput.options[2],
      defaultPollInput.options[3],
      ...newInputs
    ]
  });

  // Remove the third option
  await t.click(page.removeOptionButton(2));
  await page.checkFormInputs(t, {
    ...defaultPollInput,
    options: [
      defaultPollInput.options[2],
      defaultPollInput.options[3],
      newInputs[1]
    ]
  });
});
