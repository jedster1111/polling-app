import { Selector, t } from "testcafe";

export enum IsOpenText {
  open = "Poll is open ",
  closed = "Poll is closed "
}

export interface ExpectedValues {
  username: string;
  description: string;
  pollName: string;
  userVotes: number;
  voteLimit: number;
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

  options = Selector(".ant-table-row");
  actionButtons = {
    editButton: Selector(".edit-button"),
    deleteButton: Selector(".delete-button"),
    openButton: Selector(".open-button")
  };

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
      .expect(this.values.title.textContent)
      .eql(expectedValues.pollName)
      // description
      .expect(this.values.description.textContent)
      .eql(expectedValues.description)
      // creatorName
      .expect(this.values.creatorName.textContent)
      .eql(expectedValues.username)
      // voteLimit && userVotes
      .expect(this.values.voteCount.textContent)
      .eql(`Votes: ${expectedValues.userVotes} / ${expectedValues.voteLimit}`)
      // isOpenText
      .expect(this.values.isOpen.textContent)
      .eql(expectedValues.isOpenText);

    // check that options actually have the required length
    await this.checkOptions(expectedValues);
  };

  checkIsOpenText = async (isOpen: boolean) =>
    await t
      .expect(this.values.isOpen.textContent)
      .eql(isOpen ? IsOpenText.open : IsOpenText.closed);

  checkActionButtons = async (
    checkIsVisible: "isVisible" | "notVisible" = "isVisible"
  ) => {
    if (checkIsVisible === "isVisible") {
      await t
        .expect(this.actionButtons.deleteButton.exists)
        .ok("Delete button is not showing")
        .expect(this.actionButtons.editButton.exists)
        .ok("Edit button is not showing")
        .expect(this.actionButtons.openButton.exists)
        .ok("Open button is not showing");
    } else {
      await t
        .expect(this.actionButtons.deleteButton.exists)
        .notOk("Delete button is showing")
        .expect(this.actionButtons.editButton.exists)
        .notOk("Edit button is showing")
        .expect(this.actionButtons.openButton.exists)
        .notOk("Open button is showing");
    }
  };

  clickEditButton = async () => await t.click(this.actionButtons.editButton);
  clickDeleteButton = async () =>
    await t.click(this.actionButtons.deleteButton);
  clickOpenButton = async () => await t.click(this.actionButtons.openButton);

  private async checkOptions(expectedValues: ExpectedValues) {
    await t.expect(this.options.count).eql(expectedValues.options.length);
    // Use this loop as foreach doesn't handle async
    for (const [index, option] of expectedValues.options.entries()) {
      await t
        .expect(this.getOptionByIndex(index).ValueColumn.textContent)
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
       * @param timesToClick Default number of times to click is 1
       */
      clickVoteButton: async (timesToClick: number = 1) => {
        for (let i = 0; i < timesToClick; i++) {
          await t.click(selectors.addVoteButton);
        }
      },
      /**
       * @param timesToClick Default number of times to click is 1
       */
      clickRemoveVoteButton: async (timesToClick: number = 1) => {
        for (let i = 0; i < timesToClick; i++) {
          await t.click(selectors.removeVoteButton);
        }
      },
      checkNumberOfVotesFromUser: async (expectedNumberOfVotes: number) => {
        await t
          .expect(selectors.userVotes.textContent)
          .eql(`${expectedNumberOfVotes}`);
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
