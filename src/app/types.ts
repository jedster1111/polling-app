export interface Poll {
  creator: User;
  pollName: string;
  description: string;
  pollId: string;
  options: PollOption[];
  voteLimit: number;
  optionVoteLimit: number;
  isOpen: boolean;
  totalVotes: number;
}
export interface User {
  id: string;
  displayName?: string;
  userName: string;
  photos?: Array<{ value: string }>;
  profileUrl?: string;
}
export interface UserWithVotes extends User {
  numberOfVotes: number;
}
export interface PollOption {
  optionId: string;
  value: string;
  votes: UserWithVotes[];
}
export interface PollInput {
  creatorId?: string;
  pollName: string;
  description: string;
  options: string[];
  voteLimit: number;
  optionVoteLimit: number;
  namespace?: string;
}
export interface UpdatePollInput {
  pollName?: string;
  description?: string;
  options?: UpdatePollInputOption[];
  voteLimit?: number;
  optionVoteLimit?: number;
}
export interface UpdatePollInputOption {
  optionId: string;
  value: string;
}
