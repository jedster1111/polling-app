import uuid from "uuid/v1";
import db from "../models/database";
import { Poll, PollInput } from "../types";

const numberOfPolls = 3;
const generatePollInputs = (n: number) => {
  const polls: PollInput[] = [];
  for (let i = 0; i < n; i++) {
    const index = i + 1;
    polls.push({
      creatorId: `${index}`,
      pollName: `pollName${index}`,
      description: `description${index}`,
      options: ["option1", "option2"],
      voteLimit: 1,
      isOpen: true
    });
  }
  return polls;
};
const generateExpectedPolls = (n: number) => {
  const expectedPolls: Array<{
    creatorId: string;
    pollName: string;
    description: string;
    options: Array<{ optionId: string; value: string; votes: string[] }>;
    voteLimit: number;
    isOpen: boolean;
  }> = [];

  for (let i = 0; i < n; i++) {
    const index = i + 1;
    expectedPolls.push({
      creatorId: `${index}`,
      pollName: `pollName${index}`,
      description: `description${index}`,
      options: [
        { optionId: "1", value: "option1", votes: [] },
        { optionId: "2", value: "option2", votes: [] }
      ],
      voteLimit: 1,
      isOpen: true
    });
  }
  return expectedPolls;
};
const generateExpectedOptions = (updateInput: {
  pollName: string;
  description: string;
  options: Array<{ optionId: string; value: string }>;
}) => {
  const expectedPollOptions = generateExpectedPolls(1)[0].options;
  updateInput.options.forEach(option => {
    const optionToChange = expectedPollOptions.find(
      expectedOption => expectedOption.optionId === option.optionId
    );
    if (optionToChange) {
      optionToChange.value = option.value;
    }
  });
  return expectedPollOptions;
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

  describe("Testing getPolls:", () => {
    test("Can I get all the polls?", () => {
      const expectedPolls = generateExpectedPolls(numberOfPolls);
      const polls = db.getPolls();
      expect(polls).toMatchObject(expectedPolls);
    });
  });

  describe("Testing insertPoll and getPoll:", () => {
    const expectedPoll = generateExpectedPolls(1)[0];
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
      expect(poll).toMatchObject(result);
      expect(poll.options.length).toBe(result.options.length);
    });

    test("Can I get a poll by Id?", () => {
      const storedPolls = db.getPolls();
      const poll = db.getPoll(storedPolls[0].pollId);
      expect(poll).toMatchObject(storedPolls[0]);
    });
  });

  describe("Testing updatePoll:", () => {
    test("Can I update a poll's name, option value and description?", () => {
      // get a poll stored in the db
      const pollToUpdate = db.getPolls()[0];
      // the data that will be used to update the poll
      const updateInput = {
        pollName: "changedName",
        description: "changedDescription",
        options: [
          { optionId: "1", value: "changed" },
          { optionId: "2", value: "changed2" }
        ],
        voteLimit: 3
      };

      const expectedPollOptions = generateExpectedOptions(updateInput);

      const expectedPoll: Poll = {
        creatorId: pollToUpdate.creatorId,
        pollId: pollToUpdate.pollId,
        pollName: updateInput.pollName,
        description: updateInput.description,
        options: expectedPollOptions,
        voteLimit: updateInput.voteLimit,
        isOpen: true
      };

      const poll = db.updatePoll(
        pollToUpdate.creatorId,
        pollToUpdate.pollId,
        updateInput
      );
      expect(poll).toMatchObject(expectedPoll);
    });

    test("If I try and update a non existent poll, is an error thrown?", () => {
      const PollId = uuid();
      expect(() => {
        db.updatePoll("1", PollId, { description: "changed" });
      }).toThrow(`Poll with Id ${PollId} could not be found`);
    });

    test("If I try and update a poll using empty strings, are the changes ignored?", () => {
      const inputPoll = db.getPolls()[0];
      const updatePoll = db.updatePoll(inputPoll.creatorId, inputPoll.pollId, {
        pollName: "",
        description: ""
      });
      expect(updatePoll).toMatchObject(inputPoll);
    });

    test("Should delete an option when I input an empty string", () => {
      const inputPoll = db.getPolls()[0];
      inputPoll.options.shift();
      const updatePoll = db.updatePoll(inputPoll.creatorId, inputPoll.pollId, {
        options: [{ optionId: "1", value: "" }]
      });
      expect(updatePoll).toMatchObject(inputPoll);
    });
  });

  describe("Testing votePoll:", () => {
    test("Can I vote on a poll?", () => {
      const expectedPoll = generateExpectedPolls(1)[0];
      expectedPoll.options[0].votes = ["1"];
      const poll = db.votePoll("1", {
        optionId: "1",
        voterId: expectedPoll.creatorId
      });
      expect(poll).toMatchObject(expectedPoll);
    });
    test("Can I vote on a poll and then remove the vote", () => {
      const expectedPoll = generateExpectedPolls(1)[0];
      db.votePoll("1", { optionId: "1", voterId: "1" });
      const poll = db.votePoll("1", { optionId: "1", voterId: "1" });
      expect(poll).toMatchObject(expectedPoll);
    });
    it("should restrict my vote if the voteLimit has been reached", () => {
      const expectedPoll = generateExpectedPolls(1)[0];
      expectedPoll.options[0].votes = ["1"];
      const poll = db.votePoll("1", { optionId: "1", voterId: "1" });
      expect(poll).toMatchObject(expectedPoll);

      const voteInput2 = { optionId: "2", voterId: "1" };
      expect(() => db.votePoll("1", voteInput2)).toThrow();
    });
  });

  describe("Testing open and close Poll", () => {
    test("Can I close a poll? And then re-open it?", () => {
      // const expectedPoll = generateExpectedPolls(1)[0];
      const expectedPoll = db.getPolls()[0];
      expectedPoll.isOpen = false;

      let poll = db.closePoll(expectedPoll.creatorId, expectedPoll.pollId);

      expect(poll).toEqual(expectedPoll);

      expectedPoll.isOpen = true;

      poll = db.openPoll(expectedPoll.creatorId, expectedPoll.pollId);

      expect(poll).toEqual(expectedPoll);
    });
    test("Does trying to open/close a poll with wrong userId throw an error?", () => {
      const pollToChange = db.getPolls()[0];

      expect(() => db.closePoll("wrongId", pollToChange.pollId)).toThrowError();
      expect(() => db.openPoll("wrongId", pollToChange.pollId)).toThrowError();
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

  // describe("Testing votePoll and updatePoll", () => {
  //   test("Can I vote and then update a")
  // });
});
