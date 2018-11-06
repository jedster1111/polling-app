import { generatePoll, generateUser } from "../../tests/pollTestUtils";
import { calculateTotalVotesByUser } from "./VoteDisplay";

it("should calculate total votes by a user", () => {
  const pollData = generatePoll(1);
  const user = generateUser(1);
  const user2 = generateUser(2);

  pollData.options[0].votes.push({ ...user, numberOfVotes: 4 });
  pollData.options[1].votes.push({ ...user, numberOfVotes: 2 });
  pollData.options[2].votes.push({ ...user, numberOfVotes: 0 });

  pollData.options[0].votes.push({ ...user2, numberOfVotes: 5 });

  expect(calculateTotalVotesByUser("1", pollData)).toBe(6);
});
