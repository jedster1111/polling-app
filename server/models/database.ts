import Loki from "lokijs";
import { ErrorWithStatusCode } from "../app";
import {
  Poll,
  PollInput,
  StoredPoll,
  StoredPollOptions,
  StoredUser,
  UpdatePollInput,
  UpdatePollInputOption,
  User,
  VoteInput
} from "../types";

class Database {
  static checkValidPollInput(pollInput: PollInput) {
    const necessaryProperties: Array<keyof PollInput> = [
      "creatorId",
      "description",
      "pollName",
      "options",
      "voteLimit"
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

  db = new Loki("polling-app.db");
  polls = this.db.addCollection("polls", { clone: true, disableMeta: true });
  users = this.db.addCollection("users", { clone: true, disableMeta: true });
  pollsCount = 0;

  /**
   * Gets current polls
   * @returns returns an array of polls
   */
  getPolls(): Poll[] {
    return this.stripResultsMetadata<Poll>(this.polls.find());
  }
  getPoll(pollId: string): Poll {
    return this.stripMeta<Poll>(this.polls.findOne({ pollId }));
  }
  insertPoll(pollInput: PollInput): Poll {
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
    return this.stripMeta<Poll>(newPoll);
  }
  updatePoll(
    userId: string,
    pollId: string,
    updatePollInput: UpdatePollInput
  ): Poll {
    const poll: StoredPoll = this.polls.findOne({ pollId });
    if (poll === null) {
      throw new Error(`Poll with Id ${pollId} could not be found`);
    }
    if (poll.creatorId !== userId) {
      const error = new Error(
        `Can't edit a poll that you didn't create!`
      ) as ErrorWithStatusCode;
      error.statusCode = 401;
      throw error;
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
              if (optionToUpdate !== undefined && optionInput.value) {
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
    this.polls.update(poll);
    return this.stripMeta<Poll>(poll);
  }
  /**
   * Casts a vote on a specific poll. If the name already exists on the option the vote will be removed.
   * @param pollId Id of poll to be voted on
   * @param voteInput An object containing name of person voting and the Id of the option they're voting on
   * @returns Returns the poll that was updated
   */
  votePoll(pollId: string, voteInput: VoteInput): Poll {
    const poll: StoredPoll = this.polls.findOne({ pollId });

    const numberOfExistingVotes = poll.options.filter(option =>
      option.votes.find(vote => vote === voteInput.voterId)
    ).length;

    const optionBeingVotedOn = poll.options.find(
      option => option.optionId === voteInput.optionId
    );
    const isValidVote =
      poll &&
      optionBeingVotedOn &&
      voteInput.voterId &&
      (numberOfExistingVotes < poll.voteLimit ||
        optionBeingVotedOn.votes.find(vote => vote === voteInput.voterId));

    if (!isValidVote) {
      const err = new Error(
        `Invalid vote input: either vote/poll doesn't exist,
         username is empty, or you have reached the vote limit.`
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
    this.polls.update(poll);
    return this.stripMeta<Poll>(poll);
  }
  /**
   * Removes a poll with the specified Id.
   * @param pollId Id of the poll you wish to remove from the database.
   */
  removePoll(userId: string, pollId: string): void {
    // this.polls.findAndRemove({ pollId });
    const poll: Poll = this.polls.findOne({ pollId });
    if (poll.creatorId !== userId) {
      const error = new Error(
        `Can't delete a poll that you didn't create!`
      ) as ErrorWithStatusCode;
      error.statusCode = 401;
      throw error;
    } else {
      this.polls.remove(poll);
    }
  }
  resetPolls(): void {
    this.removeAllPollsData();
    this.resetPollsCount();
  }
  getUser(userId: string): User {
    return this.stripMeta<User>(this.users.findOne({ id: userId }));
  }
  getUsers(userIds: string[]): User[] {
    const users: StoredUser[] = userIds.map(userId =>
      this.users.findOne({ id: userId })
    );
    const filteredUsers = users.filter(user => user);
    return this.stripResultsMetadata<User>(filteredUsers);
  }
  getAllUsers(): User[] {
    return this.stripResultsMetadata<User>(this.users.find());
  }
  insertUser(userInput: any): User {
    return this.stripMeta<User>(this.users.insert(userInput));
  }
  resetUsers(): void {
    this.users.clear();
  }

  private stripResultsMetadata<T>(results: Array<T & { $loki: string }>) {
    const records = [];
    for (const result of results) {
      const cleanRec = this.stripMeta(result);
      records.push(cleanRec);
    }
    return records;
  }
  private stripMeta<T>(result: T & { $loki: string }) {
    const lokiRec = result;
    let cleanRec;
    if (result) {
      cleanRec = Object.assign({}, lokiRec);
      delete cleanRec.$loki;
    } else {
      cleanRec = result;
    }
    return cleanRec as T;
  }

  private removeAllPollsData(): void {
    this.polls.clear();
  }
  private resetPollsCount(): void {
    this.pollsCount = 0;
  }
}

export function createDatabase() {
  const database = new Database();
  return database;
}

const db = createDatabase();

export default db;
