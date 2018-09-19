import loki = require("lokijs");
import { ErrorWithStatusCode } from "../app";

export interface PollInput {
  [key: string]: string | string[];
  creatorName: string;
  pollName: string;
  description: string;
  options: string[];
}
export interface Poll {
  [key: string]: string | Option[];
  creatorName: string;
  pollName: string;
  description: string;
  pollId: string;
  options: Option[];
}
export interface UpdatePollInput {
  [key: string]: string | undefined;
  creatorName?: string;
  pollName?: string;
  description?: string;
}
export interface Option {
  optionId: string;
  value: string;
  votes: string[];
}
class Database {
  static checkValidPollInput(pollInput: PollInput) {
    const necessaryProperties = [
      "creatorName",
      "description",
      "pollName",
      "options"
    ];
    const missingProperties: string[] = [];
    necessaryProperties.forEach(property => {
      if (!pollInput.hasOwnProperty(property) || !pollInput[property]) {
        missingProperties.push(property);
      }
    });
    const hasMissingProperties = missingProperties.length > 0;
    if (hasMissingProperties) {
      let errorMessage = `Poll Input data is incorrect! Unable to create a poll. Missing properties:`;
      errorMessage +=
        " " + missingProperties.toLocaleString().replace(/[,]/g, ", ");
      const err = new Error(errorMessage) as ErrorWithStatusCode;
      err.statusCode = 400;
      throw err;
    }
  }
  db = new loki("polling-app.db");
  polls = this.db.addCollection("polls");
  pollsCount = 0;

  /**
   * Gets current polls
   * @returns returns an array of polls
   */
  getPolls(): Poll[] {
    return this.polls.find();
  }
  getPoll(query: object): Poll {
    return this.polls.findOne(query);
  }
  insertPoll(pollInput: PollInput): Poll {
    Database.checkValidPollInput(pollInput);
    const filteredOptions: string[] = pollInput.options.filter(
      option => option
    );
    const newOptions: Option[] = filteredOptions.map(
      (option: string, index: number) => {
        return {
          optionId: `${index + 1}`,
          value: option,
          votes: []
        };
      }
    );
    const cleanedPollInput = Object.assign(pollInput, {
      options: newOptions,
      pollId: `${this.pollsCount + 1}`
    });
    const newPoll: Poll = this.polls.insert(cleanedPollInput);
    this.pollsCount++;
    return newPoll;
  }
  updatePoll(
    query: { [key: string]: string },
    updatePollInput: UpdatePollInput
  ): Poll {
    const poll = this.getPoll(query);
    const updateKeys: string[] = Object.keys(updatePollInput);
    updateKeys.forEach(key => {
      poll[key] = updatePollInput[key] as string;
    });
    // this.polls.update(poll);
    return poll;
  }
  /**
   * Casts a vote on a specific poll. If the name already exists on the option the vote will be removed.
   * @param pollId Id of poll to be voted on
   * @param voteInput An object containing name of person voting and the Id of the option they're voting on
   * @returns Returns the poll that was updated
   */
  votePoll(
    pollId: string,
    voteInput: { voterName: string; optionId: string }
  ): Poll {
    const poll: Poll = db.getPoll({ pollId });
    const isValidVote =
      poll &&
      poll.options[
        poll.options.findIndex(option => option.optionId === voteInput.optionId)
      ] &&
      voteInput.voterName;
    if (!isValidVote) {
      const err = new Error(
        `Invalid vote input, either vote/poll doesn't exist or username is empty`
      ) as ErrorWithStatusCode;
      err.statusCode = 400;
      throw err;
    }
    for (const option of poll.options) {
      if (option.optionId === voteInput.optionId) {
        const indexOfName: number = option.votes.findIndex(
          vote => voteInput.voterName === vote
        );
        if (indexOfName !== -1) {
          option.votes.splice(indexOfName, 1);
        } else {
          option.votes.push(voteInput.voterName);
        }
        // if you've found the needed option then break
        break;
      }
    }
    return poll;
  }
  /**
   * Removes a poll with the specified Id.
   * @param pollId Id of the poll you wish to remove from the database.
   */
  removePollById(pollId: string): void {
    this.polls.findAndRemove({ pollId });
  }
  removeAllPollsData(): void {
    this.polls.clear();
  }
  resetCount(): void {
    this.pollsCount = 0;
  }
  reset(): void {
    this.removeAllPollsData();
    this.resetCount();
  }
}

export function createDatabase() {
  const database = new Database();
  return database;
}

const db = createDatabase();

export default db;
