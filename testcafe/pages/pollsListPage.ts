import { ReactSelector } from "testcafe-react-selectors";
import { username } from "../../secret/githubTestAuth";
import { PollInput } from "../../src/app/types";

export default class PollsListPage {
  refreshPolls = ReactSelector("FetchPollsButton");
  pollCards = ReactSelector("PollCard");

  getPollCard = (id: string) => this.pollCards.withText(id);

  pollName = (id: string) =>
    this.getPollCard(id).findReact("PollTitleContainer");

  pollDescription = (id: string) =>
    this.getPollCard(id).findReact("DescriptionContainer");

  pollCreatorName = (id: string) =>
    this.getPollCard(id).findReact("CreatorContainer");

  pollOptions = (id: string) => this.getPollCard(id).findReact("OptionDisplay");

  pollOption = (id: string, index: number) => this.pollOptions(id).nth(index);

  pollDeleteButton = (id: string) =>
    this.getPollCard(id).findReact("DeletePollButton");

  pollEditButton = (id: string) => this.getPollCard(id).findReact("EditButton");

  checkField = async (t: TestController, field: Selector, input: string) => {
    await t.expect(field.innerText).eql(input);
  };

  checkCreatedPoll = async (
    t: TestController,
    id: string,
    pollInput: PollInput
  ) => {
    const createdPoll = this.getPollCard(id);

    await t.expect(createdPoll.exists).ok("The poll wasn't created");

    await this.checkField(t, this.pollName(id), pollInput.pollName);
    await this.checkField(t, this.pollDescription(id), pollInput.description);
    await this.checkField(t, this.pollCreatorName(id), username);

    await t.expect(this.pollOptions(id).count).eql(pollInput.options.length);
    for (const [index, option] of pollInput.options.entries()) {
      await this.checkField(t, this.pollOption(id, index), option);
    }
  };
}
