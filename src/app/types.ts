export interface Poll {
  creator: PollUser;
  pollName: string;
  description: string;
  pollId: string;
  options: PollOption[];
}
export interface PollUser {
  id: string;
  displayName: string;
}
export interface PollOption {
  optionId: string;
  value: string;
  votes: PollUser[];
}
