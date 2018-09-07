import db, { PollInput } from "./database";

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
  }
];

beforeAll(() => {
  db.reset();
  pollInputs.forEach(pollInput => db.insertPoll(pollInput));
});
afterAll(() => {
  console.log(db.getPolls());
  db.reset();
});

test("test Database insertPoll and getPoll", () => {
  db.insertPoll({
    creatorName: "creatorName3",
    description: "description3",
    options: ["option1", "option2"],
    pollName: "pollName3"
  });
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
    { creatorName: "creatorName2" },
    {
      creatorName: "creatorNameChanged"
    }
  );
  const changedPoll = db.getPoll({ creatorName: "creatorNameChanged" });
  expect(changedPoll.creatorName).toBe("creatorNameChanged");
});

test("test Database removeAllPollsData() actually removes all", () => {
  let result: any = db.getPoll({ creatorName: "creatorName1" });
  expect(result.creatorName).toBe("creatorName1");
  db.removeAllPollsData();
  result = db.getPolls();
  expect(result).toEqual([]);
});
