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
});
