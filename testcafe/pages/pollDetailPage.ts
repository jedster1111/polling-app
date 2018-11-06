import { Selector } from "testcafe";

export default class PollDetailPage {
  title = Selector("#poll-detail-title");
  creatorName = Selector("#poll-detail-creator-name");
  voteCount = Selector("#vote-display-count");
  isOpen = Selector("#vote-display-is-open");

  tableHeaders = Selector(".ant-table-thead th");
  votedHeader = this.tableHeaders.withText("Voted");
  optionHeader = this.tableHeaders.withText("Option");
  votesHeader = this.tableHeaders.withText("Votes");

  options = Selector(".ant-table-row");
  getOptionByText = (text: string): Selector => this.options.withText(text);
  optionVotedCol = (text: string) => this.getOptionByText(text).find(".voted");
  optionValue = (text: string) => this.getOptionByText(text).find(".value");
}
