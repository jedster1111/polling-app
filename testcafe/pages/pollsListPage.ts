import { t } from "testcafe";
import { ReactSelector } from "testcafe-react-selectors";
import { PollInput } from "../../src/app/types";
import { username } from "../roles/roles";

export default class PollsListPage {
  refreshPolls = ReactSelector("FetchPollsButton");
  pollCards = ReactSelector("PollCard");

  getPollCard = (id: string) => this.pollCards.withText(id);

  pollName = (id: string) => this.getPollCard(id).find("p.title");

  pollDescription = (id: string) => this.getPollCard(id).find("p.description");

  pollCreatorName = (id: string) => this.getPollCard(id).find("p.name");

  pollDeleteButton = (id: string) => this.getPollCard(id).find("button.delete");

  pollEditButton = (id: string) => this.getPollCard(id).find("button.edit");

  pollDetailButton = (id: string) => this.getPollCard(id).find("button.detail");

  clickDetailButton = async (id: string) =>
    await t.click(this.pollDetailButton(id));

  checkField = async (field: Selector, input: string) => {
    await t.expect(field.textContent).eql(input);
  };

  checkCreatedPoll = async (id: string, pollInput: PollInput) => {
    const createdPoll = this.getPollCard(id);

    await t.expect(createdPoll.exists).ok("The poll wasn't created");

    await this.checkField(this.pollName(id), pollInput.pollName);
    await this.checkField(this.pollDescription(id), pollInput.description);
    await this.checkField(this.pollCreatorName(id), username);
  };
}
