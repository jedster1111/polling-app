import uuid = require("uuid/v1");
import db from "./database";

const pollsModel = db.addCollection("polls");
// pollsModel.insert({ name: "test", creator: "Jed" });
// pollsModel.insert({ name: "test2", creator: "Roy" });

interface Option {
  optionId: string;
  value: string;
  votes: string[];
}
interface PollQueryResult {
  pollId: string;
  creatorName: string;
  pollName: string;
  description: string;
  options: Option[];
}
export class Poll {
  pollId: string;
  creatorName: string;
  pollName: string;
  description: string;
  options: Option[];

  constructor(
    creatorName?: string,
    pollName?: string,
    description?: string,
    options?: string[],
    pollId?: string
  ) {
    if (pollId) {
      const pollQueryResult: PollQueryResult = this.findById(pollId);
      this.creatorName = pollQueryResult.creatorName;
      this.pollName = pollQueryResult.pollName;
      this.description = pollQueryResult.description;
      this.options = pollQueryResult.options;
      this.pollId = pollQueryResult.pollId;
    } else {
      this.creatorName = creatorName;
    }
    // this.pollId = pollId || uuid();
    // this.creatorName = creatorName;
    // this.pollName = pollName;
    // this.description = description;
    // this.options = options.map(option => ({
    //   optionId: option.optionId || uuid(),
    //   value: option.value,
    //   votes: option.votes
    // }));
  }
  findById(query: string): PollQueryResult {
    const result: PollQueryResult = pollsModel.findOne({ query });
    return result;
  }
}

export default pollsModel;
