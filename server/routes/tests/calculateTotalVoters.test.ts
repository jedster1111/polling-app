import { calculateTotalVoters } from "../pollRouter";

it("should return the total number of voters", () => {
  expect(
    calculateTotalVoters([
      { optionId: "1", votes: { 1: 2, 2: 5, 3: 0, 4: 1 }, value: "option1" }, // 3 unique votes
      { optionId: "2", votes: { 1: 2, 2: 5, 7: 3 }, value: "option2" } // 1 unique voter
    ])
  ).toBe(4);
});
