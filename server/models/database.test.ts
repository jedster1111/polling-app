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

  test("test Database updatePoll, does the name change", () => {
    db.updatePoll(
      { creatorName: "creatorName1" },
      {
        creatorName: "creatorNameChanged"
      }
    );
    const changedPoll = db.getPoll({ creatorName: "creatorNameChanged" });
    expect(changedPoll.creatorName).toBe("creatorNameChanged");
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
