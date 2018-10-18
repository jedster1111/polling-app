import { Poll, PollOption } from "../app/types";
export const generateOptions: (n: number) => PollOption[] = n => {
  const options: PollOption[] = [];
  for (let i = 0; i < n; i++) {
    options.push({
      value: `value${i + 1}`,
      optionId: `${i + 1}`,
      votes: []
    });
  }
  return options;
};
export const generatePoll: (index: number) => Poll = i => ({
  pollId: `${i}`,
  pollName: `pollName${i}`,
  options: generateOptions(3),
  description: `description${i}`,
  creator: { id: `${i}`, userName: `user${i}` },
  voteLimit: 1
});
export const generatePolls: (n: number) => Poll[] = n => {
  const polls = [];
  for (let i = 0; i < n; i++) {
    polls.push(generatePoll(i + 1));
  }
  return polls;
};
