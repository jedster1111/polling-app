import { PollInput } from "../types";
import db from "./database";

describe("Test Database class", () => {
  beforeEach(() => {
    const pollInputs: PollInput[] = [
      {
        creatorId: "creatorId1",
        description: "description1",
        options: ["option1", "option2"],
        pollName: "pollName1"
      },
      {
        creatorId: "creatorId2",
        description: "description2",
        options: ["option1", "option2"],
        pollName: "pollName2"
      },
      {
        creatorId: "creatorId3",
        description: "description3",
        options: ["option1", "option2"],
        pollName: "pollName3"
      }
    ];
    db.resetPolls();
    pollInputs.forEach(pollInput => db.insertPoll(pollInput));
    // test
  });
  afterEach(() => {
    db.resetPolls();
  });

  test("test Database insertPoll and getPoll", () => {
    const poll = db.getPoll({ pollName: "pollName1" });
    expect(poll.pollName).toBe("pollName1");
    expect(poll.pollId).toBe("1");
    expect(poll.creatorId).toBe("creatorId1");
    expect(poll.options).toEqual([
      { optionId: "1", value: "option1", votes: [] },
      { optionId: "2", value: "option2", votes: [] }
    ]);
  });

  describe("When updating the poll, can it", () => {
    test("update the description", () => {
      db.updatePoll("creatorId1", "1", {
        description: "descriptionChanged"
      });
      const changedPoll = db.getPoll({ pollId: "1" });
      expect(changedPoll.description).toBe("descriptionChanged");
    });
    test("update a single option", () => {
      db.updatePoll("creatorId1", "1", {
        pollName: "changed",
        options: [{ optionId: "1", value: "changed" }]
      });
      const changedPoll = db.getPoll({ pollId: "1" });
      expect(changedPoll.pollName).toBe("changed");
      expect(changedPoll.options[0].value).toBe("changed");
    });
    test("update multiple options", () => {
      db.updatePoll("creatorId1", "1", {
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
    // test("updates but ignores invalid inputs", () => {
    //   db.updatePoll("1", {
    //     pollNamed: "changed",
    //     options: [
    //       { optionId: "1", value: "changed" },
    //       { optionId: "20", value: "I changed too" }
    //     ]
    //   });
    //   const changedPoll = db.getPoll({ pollId: "1" });
    //   expect(changedPoll.pollName).toBe("pollName1");
    //   expect(changedPoll.options[0].value).toBe("changed");
    //   expect(changedPoll.options[1].value).toBe("option2");
    // });
    test("throw error if poll is not found", () => {
      expect(() =>
        db.updatePoll("creatorId1", "10", {
          pollName: "changed",
          options: [
            { optionId: "1", value: "changed" },
            { optionId: "20", value: "I changed too" }
          ]
        })
      ).toThrow("Poll with Id 10 could not be found");
    });
    test("updating pollname or description with empty string doesn't replace value", () => {
      const poll = db.updatePoll("creatorId1", "1", {
        pollName: "",
        description: ""
      });
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
    db.removePollById("creatorId1", "1");
    expect(db.getPoll({ pollId: "1" })).toBeNull();
  });
  test("Database votePoll succesfully votes for an option", () => {
    let poll = db.votePoll("2", { voterId: "voter1", optionId: "1" });
    expect(poll.options[0].votes).toEqual(["voter1"]);
    expect(poll.options[0].votes).toHaveLength(1);
    expect(poll.options[1].votes).toEqual([]);
    poll = db.votePoll("2", { voterId: "voter2", optionId: "1" });
    expect(poll.options[0].votes).toEqual(["voter1", "voter2"]);
    expect(poll.options[0].votes).toHaveLength(2);
    expect(poll.options[1].votes).toEqual([]);
    poll = db.votePoll("2", { voterId: "voter1", optionId: "1" });
    expect(poll.options[0].votes).toEqual(["voter2"]);
  });
  test("If you create a poll with an option with an empty string, empty string gets filtered", () => {
    const poll = db.insertPoll({
      creatorId: "1",
      options: ["test1", "", "test3"],
      description: "description",
      pollName: "pollName"
    });
    expect(poll.options.length).toBe(2);
  });
});
describe("Testing User methods", () => {
  const result = [
    { id: "1", displayName: "Jed Thompson" },
    { id: "2", displayName: "Josh Lee" }
  ];
  beforeEach(() => {
    db.insertUser({ id: "1", displayName: "Jed Thompson" });
    db.insertUser({ id: "2", displayName: "Josh Lee" });
  });
  afterEach(() => {
    db.resetUsers();
  });
  test("Can create and get a user", () => {
    const user = db.getUser("1");
    expect(user.displayName).toBe("Jed Thompson");
    expect(user.id).toBe("1");
  });
  test("Can get all users in database", () => {
    const users = db.getAllUsers();
    expect(users).toMatchObject(result);
  });
  test("Can get array of users by array of ids", () => {
    const users = db.getUsers(["1", "2"]);
    expect(users).toMatchObject(result);
  });
  test("Can remove all users from db", () => {
    db.resetUsers();
    const users = db.getAllUsers();
    expect(users).toMatchObject([]);
  });
});
