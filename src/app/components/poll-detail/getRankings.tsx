import { PollOption } from "../../types";

export function getTotalVotesOnOption(option: PollOption): number {
  return option.votes.reduce((prev, user) => prev + user.numberOfVotes, 0);
}

/**
 * Calculates rankings for a given array of options based on the number of votes they have.
 * @param options The options to generate rankings from.
 * @returns An object with the number of votes as the index and the ranking as the value.
 */
export const getRankings = (options: PollOption[]) => {
  const shallowOptions = [...options];
  const sortedOptions = shallowOptions.sort(
    (a, b) => getTotalVotesOnOption(b) - getTotalVotesOnOption(a)
  );
  const rankings = sortedOptions.reduce<{
    [votes: number]: number;
  }>((acc, option, index) => {
    const noOfVotes = getTotalVotesOnOption(option);
    if (acc[noOfVotes]) {
      return acc;
    }
    acc[noOfVotes] = index + 1;
    return acc;
  }, {});
  return rankings;
};
