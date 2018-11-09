import { Poll, PollOption, User } from "../app/types";
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
  voteLimit: 1,
  isOpen: true
});
export const generatePolls: (n: number) => Poll[] = n => {
  const polls = [];
  for (let i = 0; i < n; i++) {
    polls.push(generatePoll(i + 1));
  }
  return polls;
};
export const generateUsers = (n: number) => {
  const users: User[] = [];
  for (let i = 0; i < n; i++) {
    const index = i + 1;
    users.push(generateUser(index));
  }
  return users;
};

export function generateUser(index: number): User {
  return {
    id: `${index}`,
    displayName: `displayName${index}`,
    userName: `userName${index}`
  };
}
