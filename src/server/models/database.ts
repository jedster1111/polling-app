import loki = require("lokijs");

export interface PollInput {
  creatorName: string;
  pollName: string;
  description: string;
  options: string[];
}
interface CleanedPollInput extends PollInput {
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
    const cleanedPollInput: CleanedPollInput = Object.assign({}, pollInput);
    cleanedPollInput.options = newOptions;
    this.polls.insert(pollInput);
  }
}

export function createDatabase() {
  const database = new Database();
  return database;
}

const db = createDatabase();

export default db;
