import loki = require("lokijs");
import { ErrorWithStatusCode } from "../app";
import {
  PollInput,
  StoredPoll,
  StoredPollOptions,
  StoredUser,
  UpdatePollInput,
  UpdatePollInputOption,
  VoteInput
} from "../types";

// export interface PollInput {
//   [key: string]: string | string[];
//   creatorId: string;
//   pollName: string;
//   description: string;
//   options: string[];
// }
// export interface Poll {
//   [key: string]: string | Option[];
//   creatorId: string;
//   pollName: string;
//   description: string;
//   pollId: string;
//   options: Option[];
// }
// export interface PollResponse {
//   creator: { name: string; id: string };
//   pollName: string;
//   description: string;
//   pollId: string;
//   options: OptionResponse[];
// }
// export interface User {
//   displayName: string;
//   id: string;
//   emails?: Array<{ value: string }>;
// }
// interface UpdateOptionInput {
//   optionId: string;
//   value: string;
// }
// export interface UpdatePollInput {
//   [key: string]: string | UpdateOptionInput[] | undefined;
//   creatorName?: string;
//   pollName?: string;
//   description?: string;
//   options?: UpdateOptionInput[];
// }
// export interface Option {
//   optionId: string;
//   value: string;
//   votes: string[];
// }
// export interface OptionResponse {
//   optionId: string;
//   value: string;
//   votes: User[];
// }
class Database {
  static checkValidPollInput(pollInput: PollInput) {
    const necessaryProperties: Array<keyof PollInput> = [
      "creatorId",
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
    let errorMessage = "";
    if (hasMissingProperties) {
      errorMessage = `Poll Input data is incorrect! Unable to create a poll. Missing properties:`;
      errorMessage +=
        " " + missingProperties.toLocaleString().replace(/[,]/g, ", ") + ".";
    }
    if (pollInput.options.length === 0) {
      errorMessage += ` Can't create a poll with no options`;
    }
    if (errorMessage) {
      const err = new Error(errorMessage) as ErrorWithStatusCode;
      err.statusCode = 400;
      throw err;
    }
  }

  db = new loki("polling-app.db");
  polls = this.db.addCollection("polls");
  users = this.db.addCollection("users");
  pollsCount = 0;

  /**
   * Gets current polls
   * @returns returns an array of polls
   */
  getPolls(): StoredPoll[] {
    return this.polls.find();
  }
  getPoll(query: object): StoredPoll {
    return this.polls.findOne(query);
  }
  insertPoll(pollInput: PollInput): StoredPoll {
    Database.checkValidPollInput(pollInput);
    const filteredOptions: string[] = pollInput.options.filter(
      option => option
    );
    const newOptions: StoredPollOptions[] = filteredOptions.map(
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
    const newPoll: StoredPoll = this.polls.insert(cleanedPollInput);
    this.pollsCount++;
    return newPoll;
  }
  updatePoll(pollId: string, updatePollInput: UpdatePollInput): StoredPoll {
    const poll = this.getPoll({ pollId });
    if (poll === null) {
      throw new Error(`Poll with Id ${pollId} could not be found`);
    }
    const updateKeys = Object.keys(updatePollInput) as Array<
      keyof UpdatePollInput
    >;
    updateKeys.forEach((key: keyof UpdatePollInput) => {
      if (key !== "options" && updatePollInput[key]) {
        poll[key] = updatePollInput[key] as string;
      } else if (key === "options") {
        updatePollInput.options!.forEach(
          (optionInput: UpdatePollInputOption) => {
            if (optionInput.optionId) {
              const optionToUpdate = poll.options.find(
                option => option.optionId === optionInput.optionId
              );
              if (optionToUpdate !== undefined) {
                optionToUpdate.value = optionInput.value;
              }
            } else if (optionInput.value) {
              poll.options.push({
                optionId: `${parseInt(
                  poll.options[poll.options.length - 1].optionId,
                  10
                ) + 1}`,
                value: optionInput.value,
                votes: []
              });
            }
          }
        );
      }
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
  votePoll(pollId: string, voteInput: VoteInput): StoredPoll {
    const poll: StoredPoll = db.getPoll({ pollId });
    const isValidVote =
      poll &&
      poll.options[
        poll.options.findIndex(option => option.optionId === voteInput.optionId)
      ] &&
      voteInput.voterId;
    if (!isValidVote) {
      const err = new Error(
        `Invalid vote input, either vote/poll doesn't exist
        or username is empty. PollId: ${pollId}, OptionId: ${
          voteInput.optionId
        }, VoterId: ${voteInput.voterId}`
      ) as ErrorWithStatusCode;
      err.statusCode = 400;
      throw err;
    }
    for (const option of poll.options) {
      if (option.optionId === voteInput.optionId) {
        const indexOfId: number = option.votes.findIndex(
          vote => voteInput.voterId === vote
        );
        if (indexOfId !== -1) {
          option.votes.splice(indexOfId, 1);
        } else {
          option.votes.push(voteInput.voterId);
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
  resetPollsCount(): void {
    this.pollsCount = 0;
  }
  resetPolls(): void {
    this.removeAllPollsData();
    this.resetPollsCount();
  }
  getUser(userId: string): StoredUser {
    return this.users.findOne({ id: userId });
  }
  getUsers(userIds: string[]): StoredUser[] {
    const users: StoredUser[] = userIds.map(userId =>
      this.users.findOne({ id: userId })
    );
    return users;
  }
  getAllUsers(): StoredUser[] {
    return this.users.find();
  }
  insertUser(userInput: any): StoredUser {
    return this.users.insert(userInput);
  }
  resetUsers(): void {
    this.users.clear();
  }
}

export function createDatabase() {
  const database = new Database();
  return database;
}

const db = createDatabase();

export default db;
