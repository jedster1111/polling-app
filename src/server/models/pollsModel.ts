import uuid = require("uuid/v1");
import db from "./database";

const pollsModel = db.addCollection("polls");
// pollsModel.insert({ name: "test", creator: "Jed" });
// pollsModel.insert({ name: "test2", creator: "Roy" });

interface Option {
  optionId?: string;
  value: string;
  votes: string[];
}
export class Poll {
  pollId: string;
  creatorName: string;
  pollName: string;
  description: string;
  options: object[];

  constructor(
    creatorName: string,
    pollName: string,
    description: string,
    options: Option[],
    pollId?: string
  ) {
    this.pollId = pollId || uuid();
    this.creatorName = creatorName;
    this.pollName = pollName;
    this.description = description;
    this.options = options.map(option => ({
      optionId: option.optionId || uuid(),
      value: option.value,
      votes: option.votes
    }));
  }
}

export default pollsModel;
