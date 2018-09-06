import { Poll } from "./pollsModel";

jest.mock("uuid/v1", () => {
  let value = 1;
  return () => `${value++}`;
});

test("test Poll constructor works", () => {
  const poll = new Poll(
    "Jed",
    "test",
    "hey there",
    [{ optionId: "1", value: "chair", votes: ["Jim", "Jed"] }],
    "1"
  );
  expect(poll.creatorName).toBe("Jed");
  expect(poll.pollName).toBe("test");
  expect(poll.description).toBe("hey there");
  expect(poll.options).toMatchObject([
    { optionId: "1", value: "chair", votes: ["Jim", "Jed"] }
  ]);
  expect(poll.pollId).toBe("1");
});
test("if you don't input Id it will generate for you", () => {
  const poll = new Poll("Jed", "test", "hey there", [
    { value: "chair", votes: [] },
    { value: "bench", votes: [] }
  ]);
  expect(poll.creatorName).toBe("Jed");
  expect(poll.pollName).toBe("test");
  expect(poll.description).toBe("hey there");
  expect(poll.options).toMatchObject([
    { optionId: "2", value: "chair", votes: [] },
    { optionId: "3", value: "bench", votes: [] }
  ]);
  expect(poll.pollId).toBe("1");
});
