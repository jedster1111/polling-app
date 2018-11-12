import { calculateTotalVotes } from "../pollRouter";

it("should return correct total number of votes", () => {
  expect(
    calculateTotalVotes([
      { optionId: "1", value: "option1", votes: { 1: 5 } },
      { optionId: "1", value: "option1", votes: { 1: 8 } }
    ])
  ).toBe(13);
});

it("should return correct total number of votes", () => {
  expect(
    calculateTotalVotes([
      { optionId: "1", value: "option1", votes: { 1: 1 } },
      { optionId: "1", value: "option1", votes: { 1: 0 } },
      { optionId: "1", value: "option1", votes: { 4: 26 } }
    ])
  ).toBe(27);
});
