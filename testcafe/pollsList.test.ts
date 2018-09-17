import { Selector } from "testcafe";
import { ReactSelector, waitForReact } from "testcafe-react-selectors";

fixture("Polls List Page")
  .page("localhost:8000")
  .beforeEach(async t => {
    await t.typeText("#name", "Jed").click("#pollsListLink");
  })
  .beforeEach(async () => {
    await waitForReact();
  });

test("Can create a poll, and it appears in the list of polls", async t => {
  await t
    .click("#createPollLink")
    .typeText("#pollName", "ListTest")
    .typeText("#description", "ListTest")
    .typeText("#optionInput1", "ListTest")
    .typeText("#optionInput2", "ListTest")
    .typeText("#optionInput3", "ListTest")
    .click("#createButton")
    .click("#pollsListLink")
    .expect(
      ReactSelector("PollCard").withProps({
        pollName: "ListTest"
      }).exists
    )
    .ok("There are no polls showing");
});
