import { Selector, t } from "testcafe";
import { PollInput } from "../../src/app/types";

export enum IsOpenText {
  open = "Poll is open",
  closed = "Poll is closed"
}

interface ExpectedValues {
  username: string;
  description: string;
  pollName: string;
  userVotes: number;
  voteLimit: string;
  isOpenText: IsOpenText;
}

export default class PollDetailPage {
  options = Selector(".ant-table-row");

  values = {
    title: Selector("#poll-detail-title"),
    description: Selector("#poll-detail-description"),
    creatorName: Selector("#poll-detail-creator-name"),
    voteCount: Selector("#vote-display-count"),
    isOpen: Selector("#vote-display-is-open")
  };

  getHeaders = () => {
    const tableHeaders = Selector(".ant-table-thead th");
    return {
      votedHeader: tableHeaders.withText("Voted"),
      optionHeader: tableHeaders.withText("Option"),
      votesHeader: tableHeaders.withText("Votes")
    };
  };

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

  checkValues = async ({
    pollName,
    description,
    username,
    userVotes,
    voteLimit,
    isOpenText
  }: ExpectedValues) => {
    await t
      // pollName
      .expect(this.values.title.innerText)
      .eql(pollName)
      // description
      .expect(this.values.description.innerText)
      .eql(description)
      // creatorName
      .expect(this.values.creatorName.innerText)
      .eql(username)
      // voteLimit && userVotes
      .expect(this.values.voteCount.innerText)
      .eql(`Votes: ${userVotes} / ${voteLimit}`)
      // isOpenText
      .expect(this.values.isOpen.innerText)
      .eql(isOpenText);
  };
}
