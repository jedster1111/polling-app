import db, { PollInput } from "./database";

describe("Test Database class", () => {
  beforeEach(() => {
    const pollInputs: PollInput[] = [
      {
        creatorName: "creatorName1",
        description: "description1",
        options: ["option1", "option2"],
        pollName: "pollName1"
      },
      {
        creatorName: "creatorName2",
        description: "description2",
        options: ["option1", "option2"],
        pollName: "pollName2"
      },
      {
        creatorName: "creatorName3",
        description: "description3",
        options: ["option1", "option2"],
        pollName: "pollName3"
      }
    ];
    db.reset();
    pollInputs.forEach(pollInput => db.insertPoll(pollInput));
    // test
  });
  afterEach(() => {
    db.reset();
  });

  test("test Database insertPoll and getPoll", () => {
    const poll = db.getPoll({ pollName: "pollName1" });
    expect(poll.pollName).toBe("pollName1");
    expect(poll.pollId).toBe("1");
    expect(poll.creatorName).toBe("creatorName1");
    expect(poll.options).toEqual([
      { optionId: "1", value: "option1", votes: [] },
      { optionId: "2", value: "option2", votes: [] }
    ]);
  });

  describe("When updating the poll, can it", () => {
    test("update the name", () => {
      db.updatePoll("1", {
        creatorName: "creatorNameChanged"
      });
      const changedPoll = db.getPoll({ creatorName: "creatorNameChanged" });
      expect(changedPoll.creatorName).toBe("creatorNameChanged");
    });
    test("update a single option", () => {
      db.updatePoll("1", {
        pollName: "changed",
        options: [{ optionId: "1", value: "changed" }]
      });
      const changedPoll = db.getPoll({ pollId: "1" });
      expect(changedPoll.pollName).toBe("changed");
      expect(changedPoll.options[0].value).toBe("changed");
    });
    test("update multiple options", () => {
      db.updatePoll("1", {
        pollName: "changed",
        options: [
          { optionId: "1", value: "changed" },
          { optionId: "2", value: "I changed too" }
        ]
      });
      const changedPoll = db.getPoll({ pollId: "1" });
      expect(changedPoll.pollName).toBe("changed");
      expect(changedPoll.options[0].value).toBe("changed");
      expect(changedPoll.options[1].value).toBe("I changed too");
    });
    test("updates but ignores invalid inputs", () => {
      db.updatePoll("1", {
        pollNamed: "changed",
        options: [
          { optionId: "1", value: "changed" },
          { optionId: "20", value: "I changed too" }
        ]
      });
      const changedPoll = db.getPoll({ pollId: "1" });
      expect(changedPoll.pollName).toBe("pollName1");
      expect(changedPoll.options[0].value).toBe("changed");
      expect(changedPoll.options[1].value).toBe("option2");
    });
    test("throw error if poll is not found", () => {
      expect(() =>
        db.updatePoll("10", {
          pollNamed: "changed",
          options: [
            { optionId: "1", value: "changed" },
            { optionId: "20", value: "I changed too" }
          ]
        })
      ).toThrow("Poll with Id 10 could not be found");
    });
    test("updating pollname or description with empty string doesn't replace value", () => {
      const poll = db.updatePoll("1", { pollName: "", description: "" });
      expect(poll.pollName).toBe("pollName1");
      expect(poll.description).toBe("description1");
    });
  });
  test("test Database removeAllPollsData removes all polls", () => {
    db.removeAllPollsData();
    const result = db.getPolls();
    expect(result).toEqual([]);
  });
  test("Database can remove a poll by Id", () => {
    db.removePollById("1");
    expect(db.getPoll({ pollId: "1" })).toBeNull();
  });
  test("Database votePoll succesfully votes for an option", () => {
    let poll = db.votePoll("2", { voterName: "voter", optionId: "1" });
    expect(poll.options[0].votes).toEqual(["voter"]);
    expect(poll.options[0].votes).toHaveLength(1);
    expect(poll.options[1].votes).toEqual([]);
    poll = db.votePoll("2", { voterName: "voter2", optionId: "1" });
    expect(poll.options[0].votes).toEqual(["voter", "voter2"]);
    expect(poll.options[0].votes).toHaveLength(2);
    expect(poll.options[1].votes).toEqual([]);
    poll = db.votePoll("2", { voterName: "voter", optionId: "1" });
    expect(poll.options[0].votes).toEqual(["voter2"]);
  });
  test("If you create a poll with an option with an empty string, empty string gets filtered", () => {
    const poll = db.insertPoll({
      creatorName: "Jed",
      options: ["test1", "", "test3"],
      description: "description",
      pollName: "pollName"
    });
    expect(poll.options.length).toBe(2);
  });
});
