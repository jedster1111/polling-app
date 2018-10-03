import { Selector } from "testcafe";
import { ReactSelector } from "testcafe-react-selectors";

export default class CreatePollPage {
  pollNameInput = Selector("#pollName");
  descriptionInput = Selector("#description");
  optionInputs = ReactSelector("StyledOptionTextInput");
  createPollButton = Selector("#createButton");
  discardPollButton = Selector("#discardButton");
  removeOptionButtons = ReactSelector("OptionsInput")
    .child("button")
    .withText("-");
  AddOptionButton = ReactSelector("OptionsInput")
    .child("button")
    .withText("+");
}
