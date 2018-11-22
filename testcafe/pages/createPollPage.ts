import { Selector } from "testcafe";
import { ReactSelector } from "testcafe-react-selectors";
import { PollInput } from "../../src/app/types";

const typeText = async (t: TestController, input: Selector, text: string) => {
  const currentValue = await input.value;
  if (currentValue !== text) {
    text
      ? await t.typeText(input, text, { replace: true })
      : await t.selectText(input).pressKey("delete");
  }
};

const checkInput = async (
  t: TestController,
  inputBox: Selector,
  value: string
) => await t.expect(inputBox.value).eql(value);

export default class CreatePollPage {
  pollNameInput = Selector("#pollName");
  descriptionInput = Selector("#description");
  optionInputs = Selector(".optionInput input");
  createPollButton = Selector("#createButton");
  discardPollButton = Selector("#discardButton");
  removeOptionButtons = Selector("button.removeOption");
  addOptionButton = Selector("#addOption");
  voteLimitInput = Selector("#voteLimit");
  optionVoteLimitInput = Selector("#optionVoteLimit");
  allInputs = ReactSelector("PollForm").find("input[type='text']");
  removeOptionButton = (index: number) => this.removeOptionButtons.nth(index);

  fillFormInputs = async (t: TestController, pollInput: PollInput) => {
    await typeText(t, this.pollNameInput, pollInput.pollName);
    await typeText(t, this.descriptionInput, pollInput.description);
    for (const [index, option] of pollInput.options.entries()) {
      await typeText(t, this.optionInputs.nth(index), option);
    }
    await typeText(t, this.voteLimitInput, pollInput.voteLimit.toString());
    await typeText(
      t,
      this.optionVoteLimitInput,
      pollInput.optionVoteLimit.toString()
    );
  };

  checkFormInputs = async (t: TestController, pollInput: PollInput) => {
    await checkInput(t, this.pollNameInput, pollInput.pollName);
    await checkInput(t, this.descriptionInput, pollInput.description);
    // need to use this as foreach loop doesn't hadnle async callbacks!
    for (const [index, option] of pollInput.options.entries()) {
      await checkInput(t, this.optionInputs.nth(index), option);
    }
  };
}
