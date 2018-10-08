import { Selector } from "testcafe";
import { ReactSelector } from "testcafe-react-selectors";
import { PollInput } from "../../src/app/types";

const typeText = async (t: TestController, input: Selector, text: string) => {
  text
    ? await t.typeText(input, text, { replace: true })
    : await t.selectText(input).pressKey("delete");
};

const checkInput = async (
  t: TestController,
  inputBox: Selector,
  value: string
) => await t.expect(inputBox.value).eql(value);

export default class CreatePollPage {
  pollNameInput = Selector("#pollName");
  descriptionInput = Selector("#description");
  optionInputs = ReactSelector("StyledOptionTextInput");
  createPollButton = Selector("#createButton");
  discardPollButton = Selector("#discardButton");
  removeOptionButtons = ReactSelector("OptionsInput")
    .find("button")
    .withText("-");
  addOptionButton = ReactSelector("OptionsInput")
    .find("button")
    .withText("+");
  allInputs = ReactSelector("PollForm").find("input[type='text']");
  removeOptionButton = (index: number) => this.removeOptionButtons.nth(index);

  fillFormInputs = async (t: TestController, pollInput: PollInput) => {
    await typeText(t, this.pollNameInput, pollInput.pollName);
    await typeText(t, this.descriptionInput, pollInput.description);
    for (const [index, option] of pollInput.options.entries()) {
      await typeText(t, this.optionInputs.nth(index), option);
    }
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
