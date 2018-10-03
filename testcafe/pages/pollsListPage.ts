import { ReactSelector } from "testcafe-react-selectors";

export default class PollsListPage {
  refreshPolls = ReactSelector("FetchPollsButton");
  pollCards = ReactSelector("PollCard");
  getPollCard = (i: number) => this.pollCards.nth(i);
  creatorName = (i: number, pollCard: Selector) =>
    this.getPollCard(i).findReact("PollTitleContainer");
}
