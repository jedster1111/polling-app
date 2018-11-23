import Loki from "lokijs";
import UrlSafeString from "url-safe-string";
import { ErrorWithStatusCode } from "../app";
import {
  Poll,
  PollInput,
  StoredPoll,
  StoredPollOption,
  StoredUser,
  UpdatePollInput,
  UpdatePollInputOption,
  User,
  VoteInput
} from "../types";
import calculateNumberOfVotesFromUser from "./calculateNumberOfVotesFromUser";

const { generate: makeStringUrlSafe } = UrlSafeString();

class Database {
  static checkValidPollInput(pollInput: PollInput) {
    const necessaryProperties: Array<keyof PollInput> = [
      "creatorId",
      "description",
      "pollName",
      "options",
      "voteLimit",
      "optionVoteLimit"
    ];
    const missingProperties: string[] = [];
    necessaryProperties.forEach(property => {
      if (
        !pollInput.hasOwnProperty(property) ||
        pollInput[property] === undefined ||
        pollInput[property] === "" ||
        (property === "options" && pollInput[property].length === 0)
      ) {
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
    if (pollInput.optionVoteLimit > pollInput.voteLimit) {
      errorMessage += ` Option-vote limit can't be bigger than the vote-limit.`;
    }
    if (pollInput.voteLimit <= 0) {
      errorMessage += ` Vote limit can't be less than or equal to 0!`;
    }
    if (pollInput.optionVoteLimit <= 0) {
      errorMessage += ` Option vote limit can't be less than or equal to 0!`;
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
  getPollsByNamespace(namespace: string): Poll[] {
    return this.stripResultsMetadata<Poll>(this.polls.find({ namespace }));
  }
  getPoll(pollId: string, namespace: string): Poll {
    return this.stripMeta<Poll>(this.polls.findOne({ pollId, namespace }));
  }
  insertPoll(pollInput: PollInput): Poll {
    Database.checkValidPollInput(pollInput);
    const filteredOptions = pollInput.options.filter(option => option.value);
    const newOptions: StoredPollOption[] = filteredOptions.map(
      (option, index) => {
        return {
          ...option,
          optionId: `${index + 1}`,
          votes: {}
        };
      }
    );
    const cleanedPollInput = Object.assign(pollInput, {
      options: newOptions,
      pollId: `${this.pollsCount + 1}`,
      namespace: makeStringUrlSafe(pollInput.namespace || "public")
    });
    const newPoll: StoredPoll = this.polls.insert(cleanedPollInput);
    this.pollsCount++;
    return this.stripMeta<Poll>(newPoll);
  }
  // This could really be cleaned up
  updatePoll(
    userId: string,
    pollId: string,
    updatePollInput: UpdatePollInput,
    urlNamespace: string
  ): Poll {
    const poll: StoredPoll = this.polls.findOne({
      pollId,
      namespace: urlNamespace
    });
    if (!poll) {
      throw new Error(
        `Poll with Id ${pollId} in namespace ${urlNamespace} could not be found`
      );
    }
    if (poll.creatorId !== userId) {
      this.throwErrorWithStatusCode(
        "Can't edit a poll that you didn't create!",
        401
      );
    }
    if (
      (updatePollInput.optionVoteLimit || poll.optionVoteLimit) >
      (updatePollInput.voteLimit || poll.voteLimit)
    ) {
      this.throwErrorWithStatusCode(
        "Can't set the option-vote limit to be lower than the vote-limit!",
        400
      );
    }
    if (
      updatePollInput.voteLimit !== undefined &&
      updatePollInput.voteLimit <= 0
    ) {
      this.throwErrorWithStatusCode(
        "Can't create a poll with a vote limit of 0 or less!",
        400
      );
    }
    if (
      updatePollInput.optionVoteLimit !== undefined &&
      updatePollInput.optionVoteLimit <= 0
    ) {
      this.throwErrorWithStatusCode(
        "Can't create a poll with a option vote limit of 0 or less!",
        400
      );
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
              if (optionToUpdate !== undefined && optionInput.value !== "") {
                optionToUpdate.value = optionInput.value;
              } else if (optionToUpdate !== undefined) {
                poll.options.splice(poll.options.indexOf(optionToUpdate), 1);
              }
            } else if (optionInput.value) {
              const lastOption = poll.options[poll.options.length - 1];
              poll.options.push({
                optionId: `${parseInt(
                  lastOption ? lastOption.optionId : "1",
                  10
                ) + 1}`,
                value: optionInput.value,
                votes: {}
              });
            }
          }
        );
      }
    });
    if (poll.options.length === 0) {
      this.throwErrorWithStatusCode("Can't delete all options!", 400);
    }
    this.polls.update(poll);
    return this.stripMeta<Poll>(poll);
  }

  /**
   * Casts a vote on a specific poll. Can cast multiple votes on a single option.
   * @param pollId Id of poll to be voted on
   * @param voteInput An object containing name of person voting and the Id of the option they're voting on
   * @returns Returns the poll that was voted on
   */
  votePoll(pollId: string, voteInput: VoteInput, namespace: string): Poll {
    const poll: StoredPoll = this.polls.findOne({ pollId, namespace });

    this.checkValidVoteAndThrowErrors(poll, voteInput);

    const optionToVote = poll.options.find(
      option => option.optionId === voteInput.optionId
    );

    if (optionToVote) {
      const numberOfVotes = optionToVote.votes[voteInput.voterId];
      if (!numberOfVotes) {
        optionToVote.votes[voteInput.voterId] = 1;
      } else {
        optionToVote.votes[voteInput.voterId]++;
      }
    }

    this.polls.update(poll);

    return this.stripMeta<Poll>(poll);
  }

  removeVotePoll(
    pollId: string,
    voteInput: VoteInput,
    namespace: string
  ): Poll {
    const poll: StoredPoll = this.polls.findOne({ pollId, namespace });

    if (!poll) {
      this.throwErrorWithStatusCode(
        `Poll with id "${pollId}" in namespace "${namespace}" can't be found!`,
        400
      );
    }
    if (!poll.isOpen) {
      this.throwErrorWithStatusCode("This poll has been closed!", 400);
    }

    const optionToVote = poll.options.find(
      option => option.optionId === voteInput.optionId
    );

    if (!optionToVote) {
      this.throwErrorWithStatusCode("That option does not exist", 400);
    } else if (!optionToVote.votes[voteInput.voterId]) {
      this.throwErrorWithStatusCode(
        "Can't remove a vote from an option that you don't have any existing votes on!",
        400
      );
    } else {
      optionToVote.votes[voteInput.voterId]--;
    }

    this.polls.update(poll);

    return this.stripMeta<Poll>(poll);
  }

  openPoll(userId: string, pollId: string, namespace: string): Poll {
    const poll: StoredPoll = this.polls.findOne({ pollId, namespace });
    if (!poll) {
      this.throwErrorWithStatusCode(
        `Poll with id ${pollId} in namespace ${namespace} does not exist!`,
        400
      );
    }
    if (poll.creatorId !== userId) {
      this.throwErrorWithStatusCode(
        "Can't open a poll that you didn't create!",
        401
      );
    }
    poll.isOpen = true;
    this.polls.update(poll);
    return this.stripMeta<Poll>(poll);
  }

  closePoll(userId: string, pollId: string, namespace: string): Poll {
    const poll: StoredPoll = this.polls.findOne({ pollId, namespace });
    if (!poll) {
      this.throwErrorWithStatusCode(
        `Poll with id ${pollId} in namespace ${namespace} does not exist!`,
        400
      );
    }
    if (poll.creatorId !== userId) {
      this.throwErrorWithStatusCode(
        "Can't close a poll that you didn't create!",
        401
      );
    }
    poll.isOpen = false;
    this.polls.update(poll);
    return this.stripMeta<Poll>(poll);
  }

  /**
   * Removes a poll with the specified Id.
   * @param pollId Id of the poll you wish to remove from the database.
   */
  removePoll(userId: string, pollId: string, namespace: string): void {
    const poll: Poll = this.polls.findOne({ pollId, namespace });
    if (!poll) {
      this.throwErrorWithStatusCode(
        `A poll with id ${pollId} in namespace ${namespace} does not exist!`,
        400
      );
    }

    if (poll.creatorId !== userId) {
      this.throwErrorWithStatusCode(
        "Can't delete a poll that you didn't create!",
        401
      );
    }

    this.polls.remove(poll);
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

  /**
   * Checks if a vote input for a given poll is valid or not, and then throws appropiate error messages.
   * @param poll The poll that is being voted on, can be undefined.
   * @param voteInput VoteInput containing voterId and optionId
   */
  private checkValidVoteAndThrowErrors(
    poll: StoredPoll | undefined,
    voteInput: VoteInput
  ): void {
    let message: string = "";
    if (!poll) {
      this.throwErrorWithStatusCode("Poll was not found!", 400);
      return;
    }

    const optionBeingVotedOn = poll.options.find(
      option => option.optionId === voteInput.optionId
    );
    const numberOfExistingVotes = calculateNumberOfVotesFromUser(
      poll.options,
      voteInput.voterId
    );

    if (!poll.isOpen) {
      message = "This poll has been closed!";
    } else if (!optionBeingVotedOn) {
      message = "That option doesn't exist!";
    } else if (numberOfExistingVotes >= poll.voteLimit) {
      message = "You've used up all of your votes!";
    } else if (
      optionBeingVotedOn.votes[voteInput.voterId] >= poll.optionVoteLimit
    ) {
      message = "You can't add anymore votes to this option!";
    }

    if (message) {
      this.throwErrorWithStatusCode(message, 400);
    }
  }

  private throwErrorWithStatusCode(message: string, statusCode: number) {
    const err = new Error(message) as ErrorWithStatusCode;
    err.statusCode = statusCode;
    throw err;
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
