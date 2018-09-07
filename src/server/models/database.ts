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
  options: any[];
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
    const cleanedPollInput: any = Object.assign(pollInput, {
      options: newOptions,
      pollId: `${this.pollsCount + 1}`
    });
    const newPoll = this.polls.insert(cleanedPollInput);
    this.pollsCount++;
    return newPoll;
  }
  updatePoll(
    query: { [key: string]: string },
    updatePollInput: UpdatePollInput
  ) {
    const poll = this.getPoll(query);
    const updateKeys: string[] = Object.keys(updatePollInput);
    updateKeys.forEach(key => {
      poll[key] = updatePollInput[key] as string;
    });
    this.polls.update(poll);
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
db.insertPoll({
  creatorName: "creatorName1",
  description: "description1",
  options: ["option1", "option2"],
  pollName: "pollName1"
});

export default db;
