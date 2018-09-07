import db, { PollInput } from "./database";

afterEach(() => {
  db.removeAllPollsData();
  db.resetCount();
});
test("test Poll constructor works", () => {
  const pollInput: PollInput = {
    creatorName: "Jed",
    description: "hey there",
    options: ["chair", "bench"],
    pollName: "test"
  };
  db.insertPoll(pollInput);
  const poll = db.getPoll({ pollName: "test" });
  expect(poll.pollName).toBe("test");
  expect(poll.pollId).toBe("1");
  expect(poll.creatorName).toBe("Jed");
  expect(poll.options).toEqual([
    { optionId: "1", value: "chair", votes: [] },
    { optionId: "2", value: "bench", votes: [] }
  ]);
});
