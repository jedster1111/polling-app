import { Selector } from "testcafe";

fixture("Create Poll Form").page("localhost:8000/create-poll");

test("If submit is missing a field text inputs should remain the same", async t => {
  await t
    .typeText("#creatorName", "Jed")
    .typeText("#description", "Descriptive!")
    .typeText("#optionInput1", "option1")
    .click("#createButton")
    .expect(Selector("#creatorName").value)
    .eql("Jed")
    .expect(Selector("#description").value)
    .eql("Descriptive!")
    .expect(Selector("#optionInput1").value)
    .eql("option1");
});
test("On succesful submit the text inputs should reset", async t => {
  await t
    .typeText("#creatorName", "Jed")
    .typeText("#pollName", "New Poll")
    .typeText("#description", "Descriptive!")
    .typeText("#optionInput1", "option1")
    .typeText("#optionInput2", "option2")
    .typeText("#optionInput3", "option3")
    .click("#createButton")
    .expect(Selector("#createPollForm").find("input[type=text]").value)
    .eql("");
});
test("Clicking the discard button should reset all fields", async t => {
  await t
    .typeText("#creatorName", "Jed")
    .typeText("#description", "Descriptive!")
    .typeText("#optionInput1", "option1")
    .click("#discardButton")
    .expect(Selector("#createPollForm").find("input[type=text]").value)
    .eql("");
});
