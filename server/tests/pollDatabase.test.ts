import db from "../models/database";
import { PollInput, StoredPoll } from "../types";

const numberOfPolls = 3;
const generatePollInputs = (n: number) => {
  const polls: PollInput[] = [];
  for (let i = 0; i < n; i++) {
    const index = i + 1;
    polls.push({
      creatorId: `${index}`,
      pollName: `pollName${index}`,
      description: `description${index}`,
      options: ["option1", "option2"]
    });
  }
  return polls;
};
const generateExpectedPolls = (n: number) => {
  const expectedPolls: StoredPoll[] = [];
  for (let i = 0; i < n; i++) {
    const index = i + 1;
    expectedPolls.push({
      pollId: `${index}`,
      creatorId: `${index}`,
      pollName: `pollName${index}`,
      description: `description${index}`,
      options: [
        { optionId: "1", value: "option1", votes: [] },
        { optionId: "2", value: "option2", votes: [] }
      ]
    });
  }
  return expectedPolls;
};

describe("Testing poll related database methods:", () => {
  beforeEach(() => {
    const pollInputs = generatePollInputs(3);
    db.resetPolls();
    pollInputs.forEach(pollInput => db.insertPoll(pollInput));
  });
  afterEach(() => {
    db.resetPolls();
  });

  describe("Testing insertPoll and getPoll:", () => {
    const expectedPoll = generateExpectedPolls(1)[0];
    expectedPoll.pollId = `${numberOfPolls + 1}`;
    test("Can I add a poll?", () => {
      const insertPollData = generatePollInputs(1)[0];
      const poll = db.insertPoll(insertPollData);
      expect(poll).toMatchObject(expectedPoll);
    });
    test("If I create a poll with options containing empty strings, do the empty strings get filtered?", () => {
      const pollInput = generatePollInputs(1)[0];
      pollInput.options.push("", "");
      const poll = db.insertPoll(pollInput);
      const result = generateExpectedPolls(1)[0];
      result.pollId = `${numberOfPolls + 1}`;
      expect(poll).toMatchObject(result);
    });
    test("Can I get a poll by Id?", () => {
      const insertPollData = generatePollInputs(1)[0];
      db.insertPoll(insertPollData);
      const poll = db.getPoll(`${numberOfPolls + 1}`);
      expect(poll).toMatchObject(expectedPoll);
    });
  });

  describe("Testing getPolls:", () => {
    test("Can I get all the polls?", () => {
      const expectedPolls = generateExpectedPolls(numberOfPolls);
      const polls = db.getPolls();
      expect(polls).toMatchObject(expectedPolls);
    });
  });

  describe("Testing updatePoll:", () => {
    test("Can I update a poll's name, option value and description?", () => {
      const expectedPoll = generateExpectedPolls(1)[0];
      expectedPoll.pollName = "changed";
      expectedPoll.description = "changed";
      expectedPoll.options[0].value = "changed";
      expectedPoll.options[1].value = "changed2";
      const poll = db.updatePoll("1", "1", {
        pollName: "changed",
        description: "changed",
        options: [
          { optionId: "1", value: "changed" },
          { optionId: "2", value: "changed2" }
        ]
      });
      expect(poll).toMatchObject(expectedPoll);
    });
    test("If I try and update a non existent poll, is an error thrown?", () => {
      expect(() => {
        db.updatePoll("1", "10", { description: "changed" });
      }).toThrow("Poll with Id 10 could not be found");
    });
    test("If I try and update a poll using empty strings, are the changes ignored?", () => {
      const poll = db.updatePoll("1", "1", {
        pollName: "",
        description: "",
        options: [{ optionId: "1", value: "" }]
      });
      expect(poll).toMatchObject(generateExpectedPolls(1)[0]);
    });
  });

  describe("Testing votePoll:", () => {
    test("Can I vote on a poll?", () => {
      const expectedPoll = generateExpectedPolls(1)[0];
      expectedPoll.options[0].votes = ["1"];
      const poll = db.votePoll("1", { optionId: "1", voterId: "1" });
      expect(poll).toMatchObject(expectedPoll);
    });
  });

  describe("Testing removePoll:", () => {
    test("Can I remove a poll?", () => {
      db.removePoll("1", "1");
      const polls = db.getPolls();
      const expectedPolls = generateExpectedPolls(numberOfPolls);
      expectedPolls.shift();
      expect(polls).toMatchObject(expectedPolls);
    });
  });
});
