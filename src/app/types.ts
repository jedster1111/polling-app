export interface Poll {
  creator: User;
  pollName: string;
  description: string;
  pollId: string;
  options: PollOption[];
}
export interface User {
  id: string;
  displayName: string;
}
export interface PollOption {
  optionId: string;
  value: string;
  votes: User[];
}
export interface UpdatePollInput {
  pollName?: string;
  description?: string;
  options?: UpdatePollInputOption[];
}
export interface UpdatePollInputOption {
  optionId: string;
  value: string;
}
