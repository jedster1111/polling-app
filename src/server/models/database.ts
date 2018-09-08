import loki = require("lokijs");

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
interface Option {
  optionId: string;
  value: string;
  votes: string[];
}
class Database {
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
    const newOptions: Option[] = pollInput.options.map(
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
   * Removes a poll with the specified Id.
   * @param pollId Id of the poll you wish to remove from the database.
   */
  removePollById(pollId: string): void {
    this.polls.findAndRemove({ pollId });
  }
  removeAllPollsData(): void {
    this.polls.removeDataOnly();
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
