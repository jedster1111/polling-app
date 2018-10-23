import { generateOptions, generateUsers } from "../../../tests/pollTestUtils";
import { getRankings } from "./getRankings";

it("should return the correct rankings", () => {
  const user = generateUsers(1)[0];

  const options = generateOptions(3);
  options.forEach((option, index) => {
    for (let i = 0; i < index; i++) {
      option.votes.push(user);
    }
  });

  expect(getRankings(options)).toEqual({ 2: 1, 1: 2, 0: 3 });

  options.forEach((option, index) => {
    for (let i = 0; i < index; i++) {
      option.votes.push(user);
    }
  });

  expect(getRankings(options)).toEqual({ 4: 1, 2: 2, 0: 3 });

  options[1].votes.push(user, user);

  // console.log(options);

  expect(getRankings(options)).toEqual({ 4: 1, 0: 3 });
});
