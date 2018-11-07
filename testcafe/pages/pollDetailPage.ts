import { Selector, t } from "testcafe";

export enum IsOpenText {
  open = "Poll is open",
  closed = "Poll is closed"
}

export interface ExpectedValues {
  username: string;
  description: string;
  pollName: string;
  userVotes: number;
  voteLimit: string;
  isOpenText: IsOpenText;
  options: string[];
}

export default class PollDetailPage {
  values = {
    title: Selector("#poll-detail-title"),
    description: Selector("#poll-detail-description"),
    creatorName: Selector("#poll-detail-creator-name"),
    voteCount: Selector("#vote-display-count"),
    isOpen: Selector("#vote-display-is-open")
  };

  voteCount = 0;

  options = Selector(".ant-table-row");

  getOptionByIndex(index: number) {
    const option = this.options.nth(index);
    const voteBar = findReactVoteBar(option);
    return this.getOptionSelectorObject(option, voteBar);
  }

  getOptionByText(text: string) {
    const option = this.options.withText(text);
    const voteBar = findReactVoteBar(option);
    return this.getOptionSelectorObject(option, voteBar);
  }
  resetVoteCount() {
    this.voteCount = 0;
  }

  getHeaders = () => {
    const tableHeaders = Selector(".ant-table-thead th");
    return {
      votedHeader: tableHeaders.withText("Voted"),
      optionHeader: tableHeaders.withText("Option"),
      votesHeader: tableHeaders.withText("Votes")
    };
  };

  checkValues = async (expectedValues: ExpectedValues) => {
    await t
      // pollName
      .expect(this.values.title.innerText)
      .eql(expectedValues.pollName)
      // description
      .expect(this.values.description.innerText)
      .eql(expectedValues.description)
      // creatorName
      .expect(this.values.creatorName.innerText)
      .eql(expectedValues.username)
      // voteLimit && userVotes
      .expect(this.values.voteCount.innerText)
      .eql(`Votes: ${expectedValues.userVotes} / ${expectedValues.voteLimit}`)
      // isOpenText
      .expect(this.values.isOpen.innerText)
      .eql(expectedValues.isOpenText);

    // check that options actually have the required length
    await this.checkOptions(expectedValues);
  };

  private addVote() {
    this.voteCount++;
  }
  private removeVote() {
    this.voteCount--;
  }

  private async checkOptions(expectedValues: ExpectedValues) {
    await t.expect(this.options.count).eql(expectedValues.options.length);
    // Use this loop as foreach doesn't handle async
    for (const [index, option] of expectedValues.options.entries()) {
      await t
        .expect(this.getOptionByIndex(index).ValueColumn.innerText)
        .eql(expectedValues.options[index]);
    }
  }

  private getOptionSelectorObject(option: Selector, voteBar: Selector) {
    const selectors = {
      VotedColumn: option.find(".voted"),
      ValueColumn: option.find(".value"),
      ranking: voteBar.find(".ranking"),
      totalVotes: voteBar.find(".total-votes"),
      userVotes: voteBar.find(".user-votes"),
      removeVoteButton: voteBar.find(".remove-vote-button"),
      addVoteButton: voteBar.find(".add-vote-button")
    };
    const functions = {
      /**
       * Default # of times to click is 1
       */
      clickVoteButton: async (n: number = 1) => {
        for (let i = 0; i < n; i++) {
          await t.click(selectors.addVoteButton);
          this.addVote();
        }
      },
      /**
       * Default # of times to click is 1
       */
      clickRemoveVoteButton: async (n: number = 1) => {
        for (let i = 0; i < n; i++) {
          await t.click(selectors.removeVoteButton);
          this.removeVote();
        }
      }
    };
    return {
      ...selectors,
      ...functions
    };
  }
}

function findReactVoteBar(option: Selector) {
  return option.find(".vote-bar");
}
