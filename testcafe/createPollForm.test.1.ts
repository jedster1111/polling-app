import Page from "./pages/createPollPage";
import { githubTestUser } from "./roles/roles";

const page = new Page();

fixture("Testing the create a poll form").page(
  "http://127.0.0.1:8000/create-poll"
);
test("If I'm not logged in submitting the form should result in no changes", async t => {
  await t
    .typeText(page.pollNameInput, "pollName")
    .typeText(page.descriptionInput, "description")
    .typeText(page.optionInputs.nth(0), "option1")
    .typeText(page.optionInputs.nth(1), "option2")
    .pressKey("enter");
  await t
    .expect(page.pollNameInput.value)
    .eql("pollName")
    .expect(page.descriptionInput.value)
    .eql("description")
    .expect(page.optionInputs.nth(0).value)
    .eql("option1")
    .expect(page.optionInputs.nth(1).value)
    .eql("option2");
});
