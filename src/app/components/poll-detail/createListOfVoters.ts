import { PollOption, User } from "../../types";

interface UserItem {
  user: User;
  numberOfVotes: number;
}

export function createListOfVoters(options: PollOption[]): UserItem[] {
  const users = options.reduce<{ [id: string]: UserItem }>((prev, option) => {
    option.votes.forEach(userWithVotes => {
      if (userWithVotes.numberOfVotes !== 0) {
        if (prev[userWithVotes.id]) {
          prev[userWithVotes.id].numberOfVotes += userWithVotes.numberOfVotes;
        } else {
          prev[userWithVotes.id] = {
            user: userWithVotes,
            numberOfVotes: userWithVotes.numberOfVotes
          };
        }
      }
    });
    return prev;
  }, {});

  return Object.entries(users).reduce<UserItem[]>((prev, [key, userItem]) => {
    prev.push(userItem);
    return prev;
  }, []);
}
