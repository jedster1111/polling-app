import { Selector } from "testcafe";

fixture("Does navbar navigate properly").page("localhost:8000");

test("Can navigate to create poll form, enter values, navigate away, back again and values should be the same", async t => {
  await t
    .click("#createPollLink")
    .expect(Selector("#createPollForm").exists)
    .ok("The create poll form hasn't appeared!?!?")
    .typeText("#pollName", "New Furniture?")
    .click("#homeLink")
    .click("#createPollLink")
    .expect(Selector("#pollName").value)
    .eql("New Furniture?");
});
