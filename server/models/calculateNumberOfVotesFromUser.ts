import { StoredPollOption } from "../types";

export default function calculateNumberOfVotesFromUser(
  options: StoredPollOption[],
  userId: string
): number {
  return options.reduce((previous, option) => {
    if (option.votes[userId]) {
      previous += option.votes[userId];
    }
    return previous;
  }, 0);
}
