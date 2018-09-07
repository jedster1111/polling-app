import loki = require("lokijs");
import uuid = require("uuid/v1");

export interface PollInput {
  creatorName: string;
  pollName: string;
  description: string;
  options: string[];
}
interface Poll extends PollInput {
  pollId: string;
  options: any[];
}
interface Option {
  optionId: string;
  value: string;
  votes: any[];
}
class Database {
  db = new loki("polling-app.db");
  polls = this.db.addCollection("polls");

  getPolls(): object[] {
    return this.polls.find();
  }
  getPoll(query: object): Poll {
    return this.polls.findOne(query);
  }
  insertPoll(pollInput: PollInput): void {
    const newOptions: Option[] = pollInput.options.map(
      (option: string, index: number) => {
        return {
          optionId: `${index}`,
          value: option,
          votes: []
        };
      }
    );
    const cleanedPollInput: Poll = Object.assign(
      { options: newOptions, pollId: uuid() },
      pollInput
    );
    this.polls.insert(cleanedPollInput);
  }
  removeAllPollsData(): void {
    this.polls.removeDataOnly();
  }
}

export function createDatabase() {
  const database = new Database();
  return database;
}

const db = createDatabase();

export default db;
