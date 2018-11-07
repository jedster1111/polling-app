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
  getOptionByText = (text: string) => {
    const option = this.options.withText(text);
    const voteBar = option.findReact("VoteBar");
    return {
      VotedColumn: option.find(".voted"),
      ValueColumn: option.find(".value"),
      ranking: voteBar.find(".ranking"),
      totalVotes: voteBar.find(".total-votes"),
      userVotes: voteBar.find(".user-votes"),
      removeVoteButton: voteBar.find(".remove-vote-button"),
      addVoteButton: voteBar.find(".add-vote-button")
    };
  };
}
