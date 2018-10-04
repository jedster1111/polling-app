import { Selector } from "testcafe";
import { ReactSelector } from "testcafe-react-selectors";

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
}
