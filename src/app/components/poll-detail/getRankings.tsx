import { PollOption } from "../../types";
/**
 * Calculates rankings for a given array of options based on the number of votes they have.
 * @param options The options to generate rankings from.
 * @returns An object with the number of votes as the index and the ranking as the value.
 */
export const getRankings = (options: PollOption[]) => {
  const shallowOptions = [...options];
  const sortedOptions = shallowOptions.sort(
    (a, b) => b.votes.length - a.votes.length
  );
  const rankings = sortedOptions.reduce<{
    [key: number]: number;
  }>((acc, option, index) => {
    const noOfVotes = option.votes.length;
    if (acc[noOfVotes]) {
      return acc;
    }
    acc[noOfVotes] = index + 1;
    return acc;
  }, {});
  return rankings;
};
