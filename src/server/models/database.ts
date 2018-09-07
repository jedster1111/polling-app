import loki = require("lokijs");

export interface PollInput {
  creatorName: string;
  pollName: string;
  description: string;
  options: string[];
}
export interface Poll extends PollInput {
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
  pollsCount = 0;

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
          optionId: `${index + 1}`,
          value: option,
          votes: []
        };
      }
    );
    const cleanedPollInput: Poll = Object.assign(pollInput, {
      options: newOptions,
      pollId: `${this.pollsCount + 1}`
    });
    this.polls.insert(cleanedPollInput);
    this.pollsCount++;
  }
  removeAllPollsData(): void {
    this.polls.removeDataOnly();
  }
  resetCount(): void {
    this.pollsCount = 0;
  }
}

export function createDatabase() {
  const database = new Database();
  return database;
}

const db = createDatabase();

export default db;
