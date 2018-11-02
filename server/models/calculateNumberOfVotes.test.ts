import { StoredPollOption } from "../types";
import calculateNumberOfVotes from "./caculateNumberOfVotesFromUser";

function generateOptionsWithVotes(
  userId: string,
  votes: number[]
): StoredPollOption[] {
  return votes.map<StoredPollOption>((noOfVotes, i) => ({
    optionId: `${i + 1}`,
    value: `option${i + 1}`,
    votes: { [userId]: noOfVotes }
  }));
}

it("should return the number of votes in total from a user", () => {
  const options: StoredPollOption[] = generateOptionsWithVotes("1", [2, 4]);
  expect(calculateNumberOfVotes(options, "1")).toBe(6);
});

it("should return 0 if no votes", () => {
  const options = generateOptionsWithVotes("1", [0, 0, 0]);
  expect(calculateNumberOfVotes(options, "1")).toBe(0);
});

it("can handle only 1 vote", () => {
  const options = generateOptionsWithVotes("1", [4]);
  expect(calculateNumberOfVotes(options, "1")).toBe(4);
});

it("can handle no options", () => {
  const options = generateOptionsWithVotes("1", []);
  expect(calculateNumberOfVotes(options, "1")).toBe(0);
});

it("can handle 4 options", () => {
  const options = generateOptionsWithVotes("1", [4, 5, 6, 7]);
  expect(calculateNumberOfVotes(options, "1")).toBe(22);
});
